const mongoose = require('mongoose');
const connection = require('../libs/connection');

const Schema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CatalogLevel',
  },
  title: {
    type: String,
    required: 'не заполнено обязательное поле {PATH}',
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
});

Schema.virtual('childs', {
  ref: 'CatalogLevel',
  localField: '_id',
  foreignField: 'parent',
});

module.exports = connection.model('CatalogLevel', Schema);
