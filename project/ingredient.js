const express = require('express');
const router = express.Router();
const prisma = require('./db');
const fetchUser = require('./middleware/fetchUser');

// Endpoint to get leftover ingredients and suggest recipes
router.get('/leftovers', fetchUser, async (req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany();

    // Generate recipe suggestions and storage tips
    const recipeSuggestions = await generateRecipeSuggestions(ingredients);
    const storageTips = generateStorageTips(ingredients);

    res.json({ ingredients, recipeSuggestions, storageTips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to generate recipe suggestions (placeholder logic)
async function generateRecipeSuggestions(ingredients) {
  // Replace with actual logic to generate recipes based on ingredients
  return [
    { recipe: 'Pasta with Tomato Sauce', requiredIngredients: ['Tomatoes', 'Pasta', 'Olive Oil'] },
    { recipe: 'Vegetable Stir Fry', requiredIngredients: ['Bell Peppers', 'Carrots', 'Soy Sauce'] }
  ];
}

// Function to generate storage tips
function generateStorageTips(ingredients) {
  // Replace with actual storage tips
  return ingredients.map(ingredient => {
    return {
      ingredient: ingredient.name,
      storageTip: ingredient.storageTips || `Store ${ingredient.name} in a cool, dry place.`
    };
  });
}

module.exports = router;
