import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarProps {
    open: boolean;
    message: string;
    severity?: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
}

const CustomSnackbar: React.FC<SnackbarProps> = ({ open, message, severity = 'success', onClose }) => {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;
