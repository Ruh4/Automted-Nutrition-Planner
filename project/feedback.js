const express = require('express');
const router = express.Router();
const prisma = require('./db');
const fetchUser = require('./middleware/fetchUser');

router.post('/', fetchUser, async (req, res) => {
  const { mealPlanId, feedback, rating } = req.body;

  if (!mealPlanId) {
    return res.status(400).json({ error: 'mealPlanId is required' });
  }

  try {
    // Convert mealPlanId to integer
    const mealPlanIdInt = parseInt(mealPlanId, 10);
    if (isNaN(mealPlanIdInt)) {
      return res.status(400).json({ error: 'Invalid mealPlanId' });
    }

    // Check if mealPlanId exists
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanIdInt },
    });

    if (!mealPlan) {
      return res.status(400).json({ error: 'Invalid mealPlanId' });
    }

    const feedbackEntry = await prisma.feedback.create({
      data: {
        userId: req.user.id,
        mealPlanId: mealPlanIdInt,
        feedback,
        rating
      }
    });
    res.status(201).json({ feedbackEntry });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/personalized', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Collect Data
    const mealHistory = await prisma.mealPlan.findMany({
      where: { userId },
      include: { recipes: true }
    });
    console.log('Meal History:', mealHistory);

    const feedbacks = await prisma.feedback.findMany({
      where: { userId }
    });
    console.log('Feedbacks:', feedbacks);

    // Preprocess Data
    const userItemMatrix = {};
    mealHistory.forEach(meal => {
      meal.recipes.forEach(recipe => {
        if (!userItemMatrix[userId]) userItemMatrix[userId] = {};
        userItemMatrix[userId][recipe.id] = feedbacks.find(fb => fb.mealPlanId === meal.id)?.rating || 0;
      });
    });
    console.log('User-Item Matrix:', userItemMatrix);

    const userIds = Object.keys(userItemMatrix);
    const itemIds = Array.from(new Set(Object.values(userItemMatrix).flatMap(ratings => Object.keys(ratings))));
    console.log('Item IDs:', itemIds);

    // Generate Recommendations based on feedback and history
    const targetUserRatings = userItemMatrix[userId];
    console.log('Target User Ratings:', targetUserRatings);

    // Fetch Recommended Recipes
    const recommendations = await prisma.recipe.findMany({
      where: {
        id: { in: itemIds.filter(itemId => !targetUserRatings[itemId]) }
      }
    });

    console.log('Recommendations:', recommendations);
    res.json({ recommendations });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
