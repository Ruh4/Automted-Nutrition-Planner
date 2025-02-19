require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const prisma = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchUser = require('./middleware/fetchUser');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '1h';
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const PORT = process.env.PORT || 3030;

const mealPlanRouter = require('./mealPlan');
const recipeRouter = require('./recipe');
const substitutionRouter = require('./substitution');
const shoppinglistRouter = require('./shoppinglist');
const feedbackRouter = require('./feedback');
const notificationRouter = require('./notification'); 
const ingredientRouter = require('./ingredient');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/signup', async (req, res) => {
  const { username, email, password, allergies, prefers, avoids, height, weight, age } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        allergies,
        prefers,
        avoids,
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseInt(age, 10),
      },
    });
    await prisma.profile.create({
      data: {
        userId: user.id,
        mealPreferences: '',
        restrictions: ''
      }
    });

    const authToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.status(201).json({ message: 'User registered', user, authToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const authToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.json({ authToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/profile', fetchUser, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: { user: true }
    });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/profile', fetchUser, async (req, res) => {
  const { mealPreferences, restrictions } = req.body;
  try {
    const existingProfile = await prisma.profile.findUnique({ where: { userId: req.user.id } });

    let profile;
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { userId: req.user.id },
        data: { mealPreferences, restrictions }
      });
    } else {
      profile = await prisma.profile.create({
        data: { userId: req.user.id, mealPreferences, restrictions }
      });
    }

    res.status(201).json(profile);
  } catch (error) {
    console.error('Error updating or creating profile:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.use('/api/mealPlan', mealPlanRouter);
app.use('/api/recipes', recipeRouter);
app.use('/substitution', substitutionRouter);
app.use('/api/shoppinglist', shoppinglistRouter);
app.use('/api/feedback', feedbackRouter); 
app.use('/api/notification', notificationRouter);
app.use('/api/ingredient', ingredientRouter);

app.use(express.static(path.join(__dirname, 'nutrition-planner/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'nutrition-planner/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
