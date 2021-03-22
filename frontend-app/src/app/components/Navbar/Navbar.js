import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AppBar, Icon, IconButton, Menu, MenuItem, Toolbar } from '@material-ui/core';

import { clearTokens } from '../../../config/Utils';
import './Navbar.scss';

const Navbar = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const history = useHistory();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        clearTokens();
        handleClose();
        history.push('/');
    };

    return (
        <AppBar position="static" className="navbar__wrapper">
            <Toolbar className="navbar__container">
                <Link to="/" className="logo"></Link>
                <IconButton onClick={handleMenu}><Icon>account_circle</Icon></IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;