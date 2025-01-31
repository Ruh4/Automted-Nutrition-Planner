require('dotenv').config();
const express = require('express');
const router = express.Router();
const prisma = require('./db');
const fetchUser = require('./middleware/fetchUser');

// Endpoint to handle POST requests to /substitution
router.post('/', fetchUser, async (req, res) => {
    const { recipeId, ingredients, substitute } = req.body;

    try {
        const substitution = await prisma.substitution.create({
            data: {
                recipeId: parseInt(recipeId),
                ingredients,
                substitute
            },
        });

        console.log('Substitution created:', substitution);
        res.status(201).json({ substitution });
    } catch (error) {
        console.error('Error creating substitution:', error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
