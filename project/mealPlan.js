const express = require('express');
const router = express.Router();
const prisma = require('./db');
const fetchUser = require('./middleware/fetchUser');

router.post('/', fetchUser, async (req, res) => {
    const { plan, mealType, nutrition, recipes, feedbacks } = req.body;
    try {
        const mealPlan = await prisma.mealPlan.create({
            data: {
                userId: req.user.id,
                plan,
                mealType,
                nutrition: JSON.stringify(nutrition),
                recipes: {
                    create: recipes.map(({ name, ingredients, instructions }) => ({
                        name,
                        ingredients: ingredients.join(', '), // Convert ingredients array to a comma-separated string
                        instructions
                    }))
                }
            },
            include: {
                recipes: true, // Include the related recipes in the response
            }
        });

        const feedbacksData = feedbacks
            .filter(({ comment }) => comment !== undefined)
            .map(({ comment, rating }) => ({
                userId: req.user.id,
                mealPlanId: mealPlan.id,
                feedback: comment,
                rating,
                createdAt: new Date()
            }));

        await prisma.feedback.createMany({
            data: feedbacksData
        });

        res.status(201).json({ mealPlan });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', fetchUser, async (req, res) => {
  try {
    const mealPlans = await prisma.mealPlan.findMany({
      where: { userId: req.user.id },
      include: { recipes: true }
    });
    res.json(mealPlans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;



