const mongoose = require('mongoose');
const connection = require('../libs/connection');
const aliaser = require('../libs/aliaser');

const Schema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CatalogLevel',
  },
  title: {
    type: String,
    required: 'не заполнено обязательное поле {PATH}',
  },
  description: {
    type: String,
  },
  image: { originalName: String, fileName: String },
  alias: {
    type: String,
    unique: true,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
});

Schema.pre('save', function s() {
  this.alias = aliaser(`${this.title}`);
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
  const update = this.getUpdate();
  const alias = aliaser(`${update.title}`);
  this.setUpdate({ ...update, alias });

  this.populate('childs');
});

Schema.pre('findOneAndDelete', function f() {
  this.populate('childs');
});

module.exports = connection.model('CatalogLevel', Schema);
