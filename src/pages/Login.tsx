import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'
import { AuthToken } from '../models/AuthToken';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { error, loading, login } = useAuth()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 8,
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Login
                        </Button>
                    )}
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </form>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Dont have an account yet?{' '}
                    <Link component={RouterLink} to="/register">
                        Sign Up
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
