import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Container, Button, List, ListItem, ListItemText, TextField, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Group as GroupType } from "../models/Group";
import IdCardDisplay from "../components/IdCardDisplay";
import StudentCardDisplay from "../components/StudentCardDisplay";
import HealthCareCardDisplay from "../components/HealthCareCardDisplay";
import { Loading } from "../components/Loading";
import { Add } from "@mui/icons-material";
import AddCardDialog from "../components/AddCardDialog";
import { AddCardsDto } from "../models/AddCardsDto";

const Group: React.FC = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [group, setGroup] = useState<GroupType | null>(null);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [addCardDialogOpen, setAddCardDialogOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGroup = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8000/api/groups/${id}/`, {
                headers: { Authorization: `Bearer ${token?.access}` },
            });
            setGroup(response.data);
        } catch (err) {
            setError("Failed to load group data");
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    useEffect(() => {
        if (token && id) {
            fetchGroup();
        }
    }, [fetchGroup, token, id]);

    const handleAddCard = async (cards: AddCardsDto) => {
        try {
            await axios.post(
                `http://localhost:8000/api/groups/add_cards/${id}/`,
                cards,
                { headers: { Authorization: `Bearer ${token?.access}` } }
            );
            await fetchGroup();
            // Optionally, refresh the group data to see updated card list
        } catch (err) {
            setError("Failed to add card");
        }
    };

    const renderCards = <T,>(
        cards: T[],
        Component: React.FC<{ card: T; refreshData: () => void; groupId: number | undefined }>
    ) => {
        if (!cards || cards.length === 0) return null;
        return cards.map((card, index) => <Component key={index} card={card} refreshData={fetchGroup} groupId={group?.id} />);
    };

    if (loading) return <Loading />;
    if (error) return <Typography color="error">{error}</Typography>;

    const handleInvite = async () => {
        try {
            await axios.post(
                `http://localhost:8000/api/invitations/${id}/`,
                { email: inviteEmail },
                {
                    headers: { Authorization: `Bearer ${token?.access}` },
                }
            );
            alert("Invitation sent successfully!");
            setInviteDialogOpen(false);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Error messages from the backend
                const errors = error.response.data;
                console.log(errors);

                if (errors.non_field_errors) {
                    console.error("Non-field error:", errors.non_field_errors[0]);
                    // Display or store the non-field error message
                    alert('Invite not sent: ' + errors.non_field_errors[0])
                }
            }
        }
    };

    return (
        <Container>
            <Typography variant="h3">Group: {group?.name}</Typography>
            {/* Display Users */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" gutterBottom>
                    Users
                </Typography>
                <Button variant="outlined" color="primary" onClick={() => setInviteDialogOpen(true)}>
                    Invite User
                </Button>
            </Box>
            {/* Invitation Dialog */}
            <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
                <DialogTitle>Invite a User to the Group</DialogTitle>
                <DialogContent>
                    <TextField
                        label="User Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInviteDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleInvite} color="primary">
                        Send Invitation
                    </Button>
                </DialogActions>
            </Dialog>
            {group?.users.length ? (
                <Box>
                    {group.users.map((user) => (
                        <Typography key={user.id}>
                            {user.first_name} {user.last_name} ({user.email})
                        </Typography>
                    ))}
                </Box>
            ) : (
                <Typography>No users in this group.</Typography>
            )}

            {/* Display Cards */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={4}>
                <Typography variant="h5" gutterBottom >
                    Cards
                </Typography>
                <Button startIcon={<Add></Add>} onClick={() => setAddCardDialogOpen(true)}>Add card</Button>
            </Box>
            <AddCardDialog open={addCardDialogOpen} onSubmit={handleAddCard} onClose={() => setAddCardDialogOpen(false)}></AddCardDialog>
            {group && !group.idCards.length && !group.healthCareCards.length && !group.studentCards.length ? (
                <Typography>No cards associated with this group.</Typography>
            ) : (
                <>
                    {renderCards(group?.idCards || [], IdCardDisplay)}
                    {renderCards(group?.studentCards || [], StudentCardDisplay)}
                    {renderCards(group?.healthCareCards || [], HealthCareCardDisplay)}
                </>
            )}
        </Container>
    );
};

export default Group;