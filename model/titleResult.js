const mongoose = require('mongoose');
const { Schema } = mongoose;

const TitleResultSchema = new Schema({
    title: String,
    results: [
        {
            industry: String,
            count: Number,
            results: [
                {
                    position: String,
                    count: Number,
                    weight: Number
                }
            ]
        }
    ]
});

module.exports = mongoose.model('TitleResult', TitleResultSchema, 'job_titles_result');

