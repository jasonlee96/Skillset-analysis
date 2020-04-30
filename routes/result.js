const express = require('express');
const Skillset = require('../model/result');
const router = express.Router();

router.get('/', (req, res) => {
    return res.json({});
});

router.get('/:term', async (req, res) => {
    let { term } = req.params;
   
    let results = await Skillset.find({ title: { $regex: term, $options: "i" } });
    
    return res.json(results);
});

module.exports = router;