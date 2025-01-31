require('dotenv').config();
const express = require('express');
const router = express.Router();
const prisma = require('./db');
const fetchUser = require('./middleware/fetchUser');

router.post('/', fetchUser, async (req, res) => {
    const { items } = req.body;
    try {
        const shoppingList = await prisma.shoppingList.create({
            data: {
                userId: req.user.id,
                items,
            }
        });
        res.status(201).json({ shoppingList });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
