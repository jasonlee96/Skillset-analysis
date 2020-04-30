const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const resultRoutes = require('./result');
const searchRoutes = require('./search');

mongoose.connect("mongodb+srv://jason:jasondb@fyp-9p31t.mongodb.net/fyp?retryWrites=true&w=majority", { useNewUrlParser: true});
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
      res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
      return res.status(200).json({});
  }
  next();
});

app.use('/api/search', searchRoutes);
app.use('/api/result', resultRoutes);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});