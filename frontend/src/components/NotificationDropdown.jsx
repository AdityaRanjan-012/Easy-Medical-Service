import React from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ anchorEl, open, onClose, notifications, onMarkAsRead }) => {
    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            onMarkAsRead(notification._id);
        }
        onClose();
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 460,
                    maxHeight: 550,
                    mt: 1.5
                }
            }}
        >
            <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="h6" component="div">
                    Notifications
                </Typography>
            </Box>
            <Divider />
            {notifications.length === 0 ? (
                <MenuItem>
                    <ListItemText primary="No notifications" />
                </MenuItem>
            ) : (
                notifications.map((notification) => (
                    <MenuItem
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        sx={{
                            py: 1.5,
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        <ListItemIcon>
                            {notification.isRead ? (
                                <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                                <AccessTimeIcon color="primary" fontSize="small" />
                            )}
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography
                                    variant="body2"
                                    sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                                >
                                    {notification.message}
                                </Typography>
                            }
                            secondary={
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mt: 0.5 }}
                                >
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </Typography>
                            }
                        />
                        {!notification.isRead && (
                            <Tooltip title="Mark as read">
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkAsRead(notification._id);
                                    }}
                                >
                                    <CheckCircleIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </MenuItem>
                ))
            )}
        </Menu>
    );
};

export default NotificationDropdown;