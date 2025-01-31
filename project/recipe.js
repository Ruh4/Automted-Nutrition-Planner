const express = require('express');
const router = express.Router();
const axios = require('axios');
const prisma = require('./db');
const fetchUser = require('./middleware/fetchUser');

router.post('/', fetchUser, async (req, res) => {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { query } = req.body;

    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        apiKey,
        query
      }
    });

    const recipes = await prisma.recipe.findMany();

    const combinedRecipes = {
      apiRecipes: response.data.results,
      dbRecipes: recipes,
    };

    res.json(combinedRecipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;


