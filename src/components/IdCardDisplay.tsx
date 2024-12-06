import React, { useState } from 'react';
import { IdCard } from '../models/IdCard';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Box
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import useDeleteCard from '../hooks/useDeleteCard';
import { useAuth } from '../hooks/useAuth';

interface IdCardDisplayProps {
  card: IdCard;
  refreshData: () => void;
  groupId: number | undefined;
}

const IdCardDisplay: React.FC<IdCardDisplayProps> = ({ card, refreshData, groupId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableCard, setEditableCard] = useState(card);

  const { isDeleting, deleteCard } = useDeleteCard(card.id, "idcard", refreshData, groupId);
  const { token, user } = useAuth();


  const toggleEdit = () => {
    if (isEditing) {
      setEditableCard(card);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (field: keyof IdCard, value: string) => {
    setEditableCard(prevCard => ({ ...prevCard, [field]: value }));
  };

  const saveChanges = async () => {
    try {
      console.log(editableCard)
      await axios.put(`http://localhost:8000/api/idcard/${card.id}/`, editableCard, {
        headers: {
          'Authorization': `Bearer ${token?.access}`,
          'Content-Type': 'application/json'
        }
      }); // Replace with your API endpoint
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
          <img src={editableCard.image_front_url} alt="ID Card Front" width="70%" />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <img src={editableCard.image_back_url} alt="ID Card Back" width="70%" />
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
          <FormControl fullWidth variant="outlined">
            <InputLabel>Sex</InputLabel>
            <Select
              value={editableCard.sex}
              disabled={!isEditing}
              label="Sex"
              onChange={(e) => handleChange("sex", e.target.value)}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Nationality"
            value={editableCard.nationality}
            fullWidth
            onChange={(e) => handleChange("nationality", e.target.value)}
            InputProps={{ readOnly: !isEditing }}
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
            label="Identifier"
            value={editableCard.identifier}
            fullWidth
            onChange={(e) => handleChange("identifier", e.target.value)}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="CAN"
            value={editableCard.can}
            fullWidth
            onChange={(e) => handleChange("can", e.target.value)}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Mothers Name"
            value={editableCard.mothersName}
            fullWidth
            onChange={(e) => handleChange("mothersName", e.target.value)}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Birth place"
            value={editableCard.birthPlace}
            fullWidth
            onChange={(e) => handleChange("birthPlace", e.target.value)}
            InputProps={{ readOnly: !isEditing }}
            variant="outlined"
          />
        </Grid>
        {user?.user_id === card.user.id &&
          <Grid size={{ xs: 12 }}>
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
    </Box>
  );
};

export default IdCardDisplay;
