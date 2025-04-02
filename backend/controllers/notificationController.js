const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');

// @desc    Get notifications for a user or hospital
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({
        recipient: req.user._id,
        recipientType: req.user.role === 'hospital' ? 'HospitalProfile' : 'User'
    })
    .populate('sender', 'name')
    .populate('booking')
    .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        count: notifications.length,
        data: notifications
    });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return res.status(404).json({
            status: 'error',
            message: 'Notification not found'
        });
    }

    // Check if user owns the notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            status: 'error',
            message: 'Not authorized to update this notification'
        });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
        status: 'success',
        data: notification
    });
});

// Helper function to create notification
exports.createNotification = async (recipient, recipientType, sender, senderType, booking, message, type) => {
    await Notification.create({
        recipient,
        recipientType,
        sender,
        senderType,
        booking,
        message,
        type
    });
}; 