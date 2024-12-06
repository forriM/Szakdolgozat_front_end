import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import { Invitation } from "../models/Invitation";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

interface InvitationsProps {
    onResponse: () => void
}

const Invitations: React.FC<InvitationsProps> = ({ onResponse }) => {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { token } = useAuth();

    const fetchInvitations = useCallback(async () => {
        try {
            const response = await axios.get<Invitation[]>("http://localhost:8000/api/invitations/", {
                headers: { Authorization: `Bearer ${token?.access}` },
            });
            console.log(response.data)
            setInvitations(response.data);
        } catch (err) {
            setInvitations([])
            setError("Failed to load invitations.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch invitations when the component loads
    useEffect(() => {
        fetchInvitations();
    }, []);

    const handleResponse = async (invitationId: number, action: "accept" | "reject") => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`http://localhost:8000/api/invitations/${invitationId}/${action}/`, {}, {
                headers: { Authorization: `Bearer ${token?.access}` },
            });
            console.log(response)
            setInvitations(invitations.filter(invitation => invitation.id !== invitationId));
            setSuccessMessage(`Invitation ${action === "accept" ? "accepted" : "rejected"} successfully.`);
            fetchInvitations()
            onResponse()
        } catch (err) {
            console.log(err)
            setError(`Failed to ${action} invitation.`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Your Invitations
            </Typography>
            {invitations && invitations.length === 0 ? (
                <Typography>No pending invitations.</Typography>
            ) : (
                invitations.map((invitation) => (
                    <Card key={invitation.id} sx={{ mb: 2 }}>

                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                                <Typography variant="h6">
                                    Group: {invitation.group.name}
                                </Typography>
                                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleResponse(invitation.id, "accept")}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleResponse(invitation.id, "reject")}
                                    >
                                        Reject
                                    </Button>
                                </Box>
                            </Box>

                            <Typography color="text.secondary">
                                Invited by: {invitation.sender.first_name} ({invitation.sender.email})
                            </Typography>

                        </CardContent>
                    </Card>
                ))
            )}

            {/* Display success or error messages */}
            <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage(null)}>
                <Alert onClose={() => setSuccessMessage(null)} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Invitations;
