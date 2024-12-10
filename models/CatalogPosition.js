const mongoose = require('mongoose');
const connection = require('../libs/connection');
const CatalogLevel = require('./CatalogLevel');

const Schema = new mongoose.Schema({
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CatalogLevel,
    required: 'не заполнено обязательное поле {PATH}',
  },
  title: {
    type: String,
    required: 'не заполнено обязательное поле {PATH}',
  },
  article: {
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

Schema.index(
  {
    title: 'text',
    article: 'text',
  },
  {
    name: 'CatalogPositionSearchIndex',
    default_language: 'russian',
  },
);

module.exports = connection.model('CatalogPosition', Schema);
