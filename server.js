require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'nutrition-planner/build')));

app.use('/api', require('./src/routes'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'nutrition-planner/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});






