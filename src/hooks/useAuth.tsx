import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { AuthToken } from '../models/AuthToken';
import { useNavigate } from 'react-router-dom';
import { DecodedToken } from '../models/DecodedToken';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    token: AuthToken | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    loading: boolean;
    error: string;
    isLoadingToken: boolean;
    user: DecodedToken | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<AuthToken | null>(null);
    const [user, setUser] = useState<DecodedToken | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoadingToken, setIsLoadingToken] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const access = localStorage.getItem('access_token');
        const refresh = localStorage.getItem('refresh_token');
        if (access && refresh) {
            setToken({ access, refresh });
        }
        setIsLoadingToken(false);

        const interval = setInterval(() => {
            refreshToken();
        }, 100000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getUserFromToken()
    }, [token])

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            const token: AuthToken = await response.json();

            localStorage.setItem('access_token', token.access);
            localStorage.setItem('refresh_token', token.refresh);
            setToken(token);

            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    const refreshToken = async () => {
        setLoading(true);
        setError('');

        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            setError('No refresh token available');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const newToken: AuthToken = await response.json();

            localStorage.setItem('access_token', newToken.access);
            localStorage.setItem('refresh_token', newToken.refresh);
            setToken(newToken);
        } catch (err) {
            setError('Failed to refresh token');
            logout();
        } finally {
            setLoading(false);
        }
    };

    const getUserFromToken = () => {
        if (!token) return null;

        try {
            const decoded = jwtDecode<DecodedToken>(token.access);
            setUser(decoded);
        } catch (error) {
            console.error("Invalid token", error);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, refreshToken, loading, error, isLoadingToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
