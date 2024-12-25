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
  image: { originalName: String, fileName: String },
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

Schema.pre('find', function f() {
  this.populate('childs');
});

Schema.pre('findOne', function f() {
  this.populate('childs');
});

Schema.pre('findOneAndUpdate', function f() {
  this.populate('childs');
});

Schema.pre('findOneAndDelete', function f() {
  this.populate('childs');
});

module.exports = connection.model('CatalogLevel', Schema);
