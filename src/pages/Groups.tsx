import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List, ListItem, ListItemText, Typography, Container, ListItemButton, Box, TextField } from '@mui/material';
import axios from 'axios';
import { Group } from '../models/Group';
import { Add, Cancel, Create } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import Invitations from '../components/Invitations';
const Groups: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [groupName, setGroupName] = useState('');
    const [openCreateGroup, setOpenCreateGroup] = useState(false)
    const navigate = useNavigate();
    const { token } = useAuth();

    // Fetch groups from backend
    const fetchGroups = async () => {
        try {
            const response = await axios.get<Group[]>('http://localhost:8000/api/groups/', {
                headers: {
                    Authorization: `Bearer ${token?.access}`
                }
            });
            console.log(response.data)
            setGroups(response.data);
        } catch (error) {
            console.error("Failed to fetch groups", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchGroups(); // Await fetchGroups to ensure the data is fetched properly
        };
        fetchData();
    }, []);

    const handleGroupClick = (groupId: number) => {
        navigate(`/groups/${groupId}`);
    };


    const handleCreateGroup = async () => {
        try {
            // Ensure the group name is not empty
            if (!groupName.trim()) {
                //replace with snackbar
                console.log("Group name cannot be empty.");
                return;
            }

            // Make the API call to create a new group
            const response = await axios.post('http://localhost:8000/api/groups/',
                {
                    name: groupName
                },
                {
                    headers: {
                        Authorization: `Bearer ${token?.access}`
                    }
                });

            // If successful, you can do something like redirecting or updating the list of groups
            console.log('Group created successfully', response.data);

            // Optionally, close the modal or form after creating the group
            setOpenCreateGroup(false);
            await fetchGroups()
            //todo replace with sncakbar
            console.log('Succesfully created'); // Clear any previous errors
        } catch (error: any) {
            console.error('Failed to create group', error);
            //TODO replace with snackbar
            console.log("There was an error creating the group.");
        }
    };

    return (
        <Container>
            <Invitations onResponse={fetchGroups}></Invitations>
            <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                <Typography variant="h4">Your Groups</Typography>
                <Button variant="contained" onClick={() => setOpenCreateGroup(!openCreateGroup)} startIcon={openCreateGroup ? <Cancel /> : <Add />}>
                    {openCreateGroup ? "Cancel" : "Create"}
                </Button>
            </Box>
            {openCreateGroup && <>
                <Typography variant="h4" gutterBottom>
                    Create Group
                </Typography>
                <Box display="flex" gap={2} mb={3}>
                    <TextField
                        label="Group Name"
                        variant="outlined"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleCreateGroup}
                    disabled={!groupName}
                >
                    Create Group
                </Button>
            </>}
            {groups.length > 0 ? (
                <List>
                    {groups.map((group) => (
                        <ListItem key={group.id} onClick={() => handleGroupClick(group.id)}>
                            <ListItemButton>
                                <ListItemText
                                    primary={`Group: ${group.name}`}
                                    secondary={`Created on: ${new Date(group.createdAt).toLocaleDateString()} by ${group.createdBy?.first_name || group.createdBy.email}`}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1" color="textSecondary">
                    You are not in any groups yet.
                </Typography>
            )}
        </Container>
    );
};

export default Groups;
