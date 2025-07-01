const mongoose = require('mongoose');
const connection = require('../libs/connection');
const aliaser = require('../libs/aliaser');

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
  alias: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});

Schema.pre('save', function s() {
  this.alias = aliaser(`${this.title}`);
});

Schema.pre('findOneAndUpdate', function u() {
  const update = this.getUpdate();
  const alias = aliaser(`${update.title}`);
  this.setUpdate({ ...update, alias });
});

module.exports = connection.model('Note', Schema);
