const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const Skillset = require('../model/result');

// mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://jason:jasondb@fyp-9p31t.mongodb.net/fyp?retryWrites=true&w=majority", { useNewUrlParser: true});
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.get('/search/:term', async(req, res) => {
    return res.status(200).send();
});

app.get('/result/:term', async (req, res) => {
    let { term } = req.params;
   
    let results = await Skillset.find();
    
    return res.status(200).send(results);
});

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});