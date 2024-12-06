import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthToken } from '../models/AuthToken';
import { CompanyRegistrationResponse } from '../models/CompanyRegistrationResponse';

const Register: React.FC = () => {
    const [companyName, setCompanyName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [vatNumber, setVatNUmber] = useState<string>('');
    const [apiKey, setApiKey] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/b2b/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: companyName,
                    vatNumber: vatNumber,
                    contactEmail: email,
                }),
            });

            if (!response.ok) {
                throw new Error('Signup failed, please check your inputs.');
            }

            const data: CompanyRegistrationResponse = await response.json();
            setApiKey(data.apiKey)


            // Optionally, redirect the user to another page, such as a dashboard
            console.log('Signup successful, access token:', data.apiKey);
        } catch (err) {
            console.error('Signup error:', err);
            setError('Signup failed, please try again.');
        } finally {
            setLoading(false);
        }
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

                {apiKey &&
                    <>
                        <Typography variant="h4" sx={{ mt: 2 }}>
                            Registration succesful
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Your Api key: <strong>{apiKey}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Store this key in a secure location because you won't be able to access it later
                        </Typography>
                    </>
                }
                {!apiKey &&
                    <>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Register company
                        </Typography>
                        <form onSubmit={handleSignup} style={{ width: '100%' }}>
                            <TextField
                                label="Company name"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                label="Vat number"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                type="password"
                                value={vatNumber}
                                onChange={(e) => setVatNUmber(e.target.value)}
                            />
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Sign Up
                                </Button>
                            )}
                            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        </form>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login">
                                Login
                            </Link>
                        </Typography>
                        <Link component={RouterLink} to="/register">
                            Register a personal account
                        </Link>
                    </>
                }
            </Box>
        </Container>
    );
};

export default Register;
