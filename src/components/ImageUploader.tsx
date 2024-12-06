import { Box, Button, InputLabel, Select, Typography } from "@mui/material"
import React, { useState } from "react";
import ReactWebcam from 'react-webcam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
interface Props {
    setImage: React.Dispatch<React.SetStateAction<File | string | null>>;
    side: string
}

export const ImageUploader: React.FC<Props> = ({ setImage, side }: Props) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const webcamRef = React.useRef<ReactWebcam>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle taking a picture with the webcam
    const handleTakePicture = () => {
        if (webcamRef.current) {
            const capturedImage = webcamRef.current.getScreenshot();
            if (capturedImage) {
                const img = new Image();
                img.src = capturedImage;
                img.onload = () => {
                    console.log(`Captured Image Width: ${img.width}, Height: ${img.height}`);
                };
                setImage(capturedImage);
                setImageSrc(capturedImage);
                setIsCameraOpen(false);
            }
        }
    };

    return (
        <>
            <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6" gutterBottom style={{ margin: 10 }}>
                    {side}
                </Typography>

                <Button variant="contained" component="label" style={{ marginRight: 16 }}>
                    Upload Image
                    <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CameraAltIcon />}
                    onClick={() => setIsCameraOpen(true)}
                >
                    Take a Picture
                </Button>
            </Box>

            {
                isCameraOpen && (
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <ReactWebcam
                            ref={webcamRef}
                            screenshotFormat="image/png"  // Use PNG for better quality
                            screenshotQuality={1}
                            forceScreenshotSourceSize={true}       // Maximum quality for screenshots
                            videoConstraints={{
                                facingMode: 'user',
                                width: { min: 1920, ideal: 1920, max: 2560 },  // Enforce higher resolution
                                height: { min: 1080, ideal: 1080, max: 1440 }
                            }}
                            style={{ width: '100%', maxWidth: '400px' }}
                        />
                        <Box mt={2}>
                            <Button variant="contained" onClick={handleTakePicture} style={{ marginRight: 10 }}>
                                Capture
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => setIsCameraOpen(false)}>
                                Close Camera
                            </Button>
                        </Box>
                    </Box>
                )
            }

            {
                imageSrc && (
                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom>
                            Preview:
                        </Typography>
                        <img src={imageSrc} alt="Card Preview" style={{ width: '300px', border: '1px solid #ccc' }} />
                    </Box>
                )
            }
        </>
    )
}