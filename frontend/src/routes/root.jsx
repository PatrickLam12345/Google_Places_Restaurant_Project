import { Outlet, Link, useNavigate } from 'react-router-dom'
import isAuthenticated from '../components/auth/IsAuthenticated'

import { Box, AppBar, Toolbar, Menu, IconButton, MenuItem } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import { useState } from 'react'


export default function Root() {
    const isAuth = isAuthenticated()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Box marginBottom={10}>
                <AppBar>
                    <Toolbar>
                        <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                            <Link style={{ textDecoration: "none", color: "white" }} to='/'>Home</Link>
                        </Box>
                        <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                            <Link style={{ textDecoration: "none", color: "white" }} to='/user/wishlist'>Places I Want to Visit</Link>
                        </Box>
                        <Box sx={{ marginLeft: 5, marginRight: 5, flexGrow: 1 }}>
                            <Link style={{ textDecoration: "none", color: "white" }} to='/user/visited'>Places I have Visited</Link>
                        </Box>
                        {isAuth ? (<>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => {
                                    setAnchorEl(null)
                                    navigate("/logout")
                                }}>Logout</MenuItem>
                            </Menu>
                        </>
                        ) : (
                            <>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => {
                                        setAnchorEl(null)
                                        navigate("/login")
                                    }}>Login</MenuItem>
                                    <MenuItem onClick={() => {
                                        setAnchorEl(null)
                                        navigate("/register")
                                    }}>Register</MenuItem>
                                </Menu>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
            <Outlet />
        </div>
    )
}