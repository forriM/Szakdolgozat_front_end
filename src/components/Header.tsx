import React from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { logout } = useAuth()

    // Open the dropdown menu
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Close the dropdown menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" style={{ backgroundColor: '#f0f0f0' }}>
            <Toolbar>

                <Typography variant="h6" style={{ flexGrow: 1, color: '#000' }}>
                    E-Wallet
                </Typography>


                <IconButton
                    aria-label="more"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    color="inherit"
                >
                    <MoreVertIcon />
                </IconButton>

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem component={Link} to="/" onClick={handleClose}>Your cards</MenuItem>
                    <MenuItem onClick={async (e) => await logout()}>Log out</MenuItem>
                    <MenuItem component={Link} to="/upload" onClick={handleClose}>Upload card</MenuItem>
                    <MenuItem component={Link} to="/groups" onClick={handleClose}>Groups</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
