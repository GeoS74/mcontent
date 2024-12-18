const mongoose = require('mongoose');
const connection = require('../libs/connection');
const CatalogLevel = require('./CatalogLevel');
const aliaser = require('../libs/aliaser');

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
  description: {
    type: String,
  },
  image: { originalName: String, fileName: String },
  isPublic: {
    type: Boolean,
    default: false,
  },
  alias: String,
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

Schema.pre('save', function s() {
  this.alias = aliaser(`${this.article}_${this.title}`);
});

Schema.pre('findOneAndUpdate', function u() {
  const update = this.getUpdate();
  const alias = aliaser(`${update.article}_${update.title}`);
  this.setUpdate({ ...update, alias });
});

module.exports = connection.model('CatalogPosition', Schema);
