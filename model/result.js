const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResultSchema = new Schema({
    title: String,
    results: [
        {
            term: String,
            value: Number
        }
    ]
});

module.exports = mongoose.model('Skillset', ResultSchema, 'result');

