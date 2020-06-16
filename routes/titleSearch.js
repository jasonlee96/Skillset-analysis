const express = require('express');
const TitleResult = require('../model/titleResult');
const router = express.Router();

router.get('/', (req, res) => {
    return res.json({});
});

router.get('/:term', async (req, res) => {
    let { term } = req.params;
   
    let results = await TitleResult.find({ title: { $regex: term, $options: "i" }}, { title: 1 });
    
    return res.json(results);
});

module.exports = router;