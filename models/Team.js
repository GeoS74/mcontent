const mongoose = require('mongoose');
const connection = require('../libs/connection');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    // required: 'не заполнено обязательное поле {PATH}',
  },
  position: {
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

Schema.index(
  {
    title: 'text',
  },
  {
    name: 'TeamSearchIndex',
    default_language: 'russian',
  },
);

module.exports = connection.model('Team', Schema);
