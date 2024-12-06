import React, { useState } from 'react';
import {
    TextField,
    Button,
    Stack,
    Box,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { StudentCard } from '../models/StudentCard';
import axios from 'axios';
import useDeleteCard from '../hooks/useDeleteCard';
import { useAuth } from '../hooks/useAuth';

interface StudentCardDisplayProps {
    card: StudentCard;
    refreshData: () => void;
    groupId: number | undefined
}

const StudentCardDisplay: React.FC<StudentCardDisplayProps> = ({ card, refreshData, groupId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableCard, setEditableCard] = useState(card);

    const { isDeleting, deleteCard } = useDeleteCard(card.id, "studentcard", refreshData, groupId);
    const { token, user } = useAuth();



    const toggleEdit = () => {
        if (isEditing) {
            setEditableCard(card); // Reset to original data if canceling edit
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (field: keyof StudentCard, value: string) => {
        setEditableCard(prevCard => ({ ...prevCard, [field]: value }));
    };

    const saveChanges = async () => {
        try {
            await axios.put(`http://localhost:8000/api/studentcard/${card.id}/`, editableCard, {
                headers: {
                    Authorization: `Bearer ${token?.access}`
                }
            });
            setIsEditing(false);
            refreshData();
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    return (
        <Box sx={{ padding: 2, display: 'flex' }}>
            <Stack spacing={1} sx={{ flex: '1', marginRight: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <img src={editableCard.image_front_url} alt="Student Card Front" width="70%" />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <img src={editableCard.image_back_url} alt="Student Card Back" width="70%" />
                </Box>
            </Stack>

            <Grid container spacing={2} sx={{ flex: '2' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Name"
                        value={editableCard.name}
                        fullWidth
                        onChange={(e) => handleChange("name", e.target.value)}
                        InputProps={{ readOnly: !isEditing }}
                        variant="outlined"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Card Number"
                        value={editableCard.cardNumber}
                        fullWidth
                        onChange={(e) => handleChange("cardNumber", e.target.value)}
                        InputProps={{ readOnly: !isEditing }}
                        variant="outlined"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Expiry Date"
                        type="date"
                        value={editableCard.expiryDate}
                        fullWidth
                        onChange={(e) => handleChange("expiryDate", e.target.value)}
                        InputProps={{ readOnly: !isEditing }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Birth Date"
                        type="date"
                        value={editableCard.birthDate}
                        fullWidth
                        onChange={(e) => handleChange("birthDate", e.target.value)}
                        InputProps={{ readOnly: !isEditing }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Issue Date"
                        type="date"
                        value={editableCard.issueDate}
                        fullWidth
                        onChange={(e) => handleChange("issueDate", e.target.value)}
                        InputProps={{ readOnly: !isEditing }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="OM Number"
                        value={editableCard.OMNUmber}
                        fullWidth
                        onChange={(e) => handleChange("OMNUmber", e.target.value)}
                        InputProps={{ readOnly: !isEditing }}
                        variant="outlined"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="School"
                        value={editableCard.school}
                        fullWidth
                        onChange={(e) => handleChange("school", e.target.value)}
                        InputProps={{ readOnly: !isEditing }}
                        variant="outlined"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Address"
                        value={editableCard.address}
                        fullWidth
                        onChange={(e) => handleChange("address", e.target.value)}
                        InputProps={{ readOnly: !isEditing }}
                        variant="outlined"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Birth place"
                        value={editableCard.placeOfBirth}
                        fullWidth
                        onChange={(e) => handleChange("placeOfBirth", e.target.value)}
                        InputProps={{ readOnly: !isEditing }}
                        variant="outlined"
                    />
                </Grid>

                {user?.user_id === card.user.id &&
                    < Grid size={{ xs: 4 }}>
                        {isEditing ? (
                            <>
                                <Button variant="contained" color="primary" onClick={saveChanges}>
                                    Save
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={toggleEdit} sx={{ marginLeft: 2 }}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" color="secondary" onClick={toggleEdit}>
                                Edit
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={deleteCard}
                            disabled={isDeleting}
                            sx={{ ml: 2 }}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </Grid>}
            </Grid>
        </Box >
    );
};

export default StudentCardDisplay;
