import { useState } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

const useDeleteCard = (cardId: number, endpoint: string, onDelete: () => void, groupId: number | undefined) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { token } = useAuth();
    const deleteCard = async () => {
        setIsDeleting(true);
        let url = `http://localhost:8000/api/${endpoint}/${cardId}/`
        if (groupId) url += `${groupId}/`
        try {
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token?.access}`
                }
            });
            onDelete()
        } catch (error) {
            console.error("Failed to delete the card:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return { isDeleting, deleteCard };
};

export default useDeleteCard;
