const mongoose = require('mongoose');
const connection = require('../libs/connection');

const Schema = new mongoose.Schema({
  title: {
    type: String,
    // required: 'не заполнено обязательное поле {PATH}',
  },
  message: {
    type: String,
  },
  image: { originalName: String, fileName: String },
  isPublic: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = connection.model('Slide', Schema);
