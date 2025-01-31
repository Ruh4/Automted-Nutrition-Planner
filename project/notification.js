const express = require('express');
const router = express.Router();
const prisma = require('./db');
const fetchUser = require('./middleware/fetchUser');

// Endpoint to create and send notifications
router.post('/notify', fetchUser, async (req, res) => {
  const { message } = req.body; // Remove `type`
  try {
    const notification = await prisma.notifications.create({
      data: {
        userId: req.user.id,
        message,
      }
    });
    // Send notification logic here (e.g., email, SMS, push notification)
    res.status(201).json({ notification });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to get notifications for a user
router.get('/notifications', fetchUser, async (req, res) => {
  try {
    const notifications = await prisma.notifications.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
