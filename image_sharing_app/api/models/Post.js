// Create Post scheme here
const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
    {
        userId: {
        type: String,
        required: true,
        },
        desc: {
        type: String,
        max: 500,
        },
        properties: {
        type: String,
        required: true,
        },
        img: {
        type: String,
        required:true,
        },
    },
    {timestamps: true}
  );


  module.exports = mongoose.model('Post', Schema);