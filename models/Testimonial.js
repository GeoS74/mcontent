const mongoose = require('mongoose');
const connection = require('../libs/connection');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: 'не заполнено обязательное поле {PATH}',
  },
  message: {
    type: String,
    required: 'не заполнено обязательное поле {PATH}',
  },
  company: {
    type: String,
  },
  photo: { originalName: String, fileName: String },
  isPublic: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = connection.model('Testimonial', Schema);
