import React, { useState } from 'react';
import { Dialog, DialogContent, List, ListItemText, Button, ListItemButton, Typography, ListItem } from '@mui/material';
import { IdCard } from '../models/IdCard';
import { StudentCard } from '../models/StudentCard';
import { HealthCareCard } from '../models/HelathCareCard';
import useFetchCards from '../hooks/useFetchCards';
import { useAuth } from '../hooks/useAuth';
import { AddCardsDto } from '../models/AddCardsDto';

interface AddCardDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (cards: AddCardsDto) => Promise<void>;
}


const AddCardDialog: React.FC<AddCardDialogProps> = ({ open, onClose, onSubmit }) => {
    const { token } = useAuth();
    const { idCards, studentCards, healthCareCards, loading } = useFetchCards(token?.access);
    const [selectedIdCardIds, setSelectedIdCardIds] = useState<number[]>([]);
    const [selectedStudentCardIds, setSelectedStudentCardIds] = useState<number[]>([]);
    const [selectedHealthCareCardIds, setSelectedHealthCareCardIds] = useState<number[]>([]);


    const toggleCardSelection = (cardId: number, type: 'HealthCareCard' | 'IdCard' | 'StudentCard') => {
        if (type === 'IdCard') {
            setSelectedIdCardIds((prevSelected) =>
                prevSelected.includes(cardId)
                    ? prevSelected.filter((id) => id !== cardId)
                    : [...prevSelected, cardId]
            );
        }
        if (type === 'HealthCareCard') {
            setSelectedHealthCareCardIds((prevSelected) =>
                prevSelected.includes(cardId)
                    ? prevSelected.filter((id) => id !== cardId)
                    : [...prevSelected, cardId]
            );
        }
        if (type === 'StudentCard') {
            setSelectedStudentCardIds((prevSelected) =>
                prevSelected.includes(cardId)
                    ? prevSelected.filter((id) => id !== cardId)
                    : [...prevSelected, cardId]
            );
        }
    };

    const handleConfirm = () => {
        onSubmit({ selectedIdCardIds, selectedStudentCardIds, selectedHealthCareCardIds });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogContent>
                {loading ? (
                    <Typography>Loading cards...</Typography>
                ) : (
                    <>
                        <Typography variant="h6">ID Cards</Typography>
                        <List>
                            {idCards.map((card: IdCard) => (
                                <ListItemButton
                                    key={card.id}
                                    onClick={() => toggleCardSelection(card.id, 'IdCard')}
                                    selected={selectedIdCardIds.includes(card.id)}
                                >
                                    <ListItemText primary={card.name} secondary={`ID: ${card.identifier}`} />
                                </ListItemButton>
                            ))}
                        </List>

                        <Typography variant="h6">Student Cards</Typography>
                        <List>
                            {studentCards.map((card: StudentCard) => (
                                <ListItemButton
                                    key={card.id}
                                    onClick={() => toggleCardSelection(card.id, 'StudentCard')}
                                    selected={selectedStudentCardIds.includes(card.id)}
                                >
                                    <ListItemText primary={card.name} secondary={`Card Number: ${card.cardNumber}`} />
                                </ListItemButton>
                            ))}
                        </List>

                        <Typography variant="h6">Healthcare Cards</Typography>
                        <List>
                            {healthCareCards.map((card: HealthCareCard) => (
                                <ListItemButton
                                    key={card.id}
                                    onClick={() => toggleCardSelection(card.id, 'HealthCareCard')}
                                    selected={selectedHealthCareCardIds.includes(card.id)}
                                >
                                    <ListItemText primary={card.name} secondary={`Card Number: ${card.cardNumber}`} />
                                </ListItemButton>
                            ))}
                        </List>

                        <Button onClick={handleConfirm} variant="contained" color="primary" fullWidth>
                            Confirm Selection
                        </Button>
                        <Button onClick={onClose} color="secondary" fullWidth>
                            Cancel
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddCardDialog;