import React, { useState } from 'react';
import { Button, MenuItem, Select, FormControl, InputLabel, Box, Typography, CircularProgress, SelectChangeEvent } from '@mui/material';
import { ImageUploader } from '../components/ImageUploader';
import { useAuth } from '../hooks/useAuth';
import CustomSnackbar from '../components/CustomSanckBar';
import axios from 'axios';

type CardType = 'idcard' | 'healthcard' | 'studentcard';

interface UploadCardDto {
    imageFront: File | string | null;
    imageBack: File | string | null;
}

const CardUpload: React.FC = () => {
    const BASE_URL = "http://127.0.0.1:8000/api/";
    const [imageFront, setImageFront] = useState<File | string | null>('');
    const [imageBack, setImageBack] = useState<File | string | null>('');
    const [cardType, setCardType] = useState<CardType | ''>('idcard');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const handleCardTypeChange = (event: SelectChangeEvent<CardType>) => {
        setCardType(event.target.value as CardType);
    };

    const uploadImages = async () => {
        if (!token) return;
        setLoading(true);

        try {
            if (cardType !== 'healthcard' && typeof imageFront !== typeof imageBack) {
                setSnackbarMessage('You cannot combine an uploaded file with a camera image.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setLoading(false);
                return;
            }

            if (!imageFront) {
                setSnackbarMessage('You need to provide an image of the front side.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setLoading(false);
                return;
            }

            if (!imageBack && cardType !== 'healthcard') {
                setSnackbarMessage('You need to provide an image of the back side for this card type.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setLoading(false);
                return;
            }

            let url = `${BASE_URL}${cardType}/`;
            const headers = {
                'Authorization': `Bearer ${token.access}`,
            };

            let response;
            if (typeof imageFront === 'string') {
                url += 'base64/';
                const data: UploadCardDto = { imageFront, imageBack };
                response = await axios.post(url, data, { headers });
            } else {
                const formData = new FormData();
                formData.append("imageFront", imageFront);
                if (imageBack) formData.append("imageBack", imageBack);
                response = await axios.post(url, formData, { headers });
            }

            if (response.status === 200 || response.status === 201) {
                setSnackbarMessage('Card successfully processed.');
                setSnackbarSeverity('success');
            } else {
                throw new Error('Error in response');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            setSnackbarMessage('Some error occurred. Please try again.');
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <Typography variant="h4" gutterBottom>
                    Upload or Take a Picture of Your Card
                </Typography>

                <Box display="flex" alignItems="center" mb={2}>
                    <FormControl variant="outlined" style={{ minWidth: 200, marginRight: 16 }}>
                        <InputLabel>Select Card Type</InputLabel>
                        <Select value={cardType} onChange={handleCardTypeChange} label="Select Card Type">
                            <MenuItem value="idcard">ID card</MenuItem>
                            <MenuItem value="healthcard">Health insurance card</MenuItem>
                            <MenuItem value="studentcard">Student ID card</MenuItem>
                        </Select>
                    </FormControl>
                    <Button onClick={uploadImages} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Submit'}
                    </Button>
                </Box>

                <ImageUploader setImage={setImageFront} side="Front side:" />
                {(cardType === 'idcard' || cardType === 'studentcard') && (
                    <ImageUploader setImage={setImageBack} side="Back Side:" />
                )}
            </Box>
            <CustomSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
            />
        </>
    );
};

export default CardUpload;
