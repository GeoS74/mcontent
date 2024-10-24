const mongoose = require('mongoose');
const connection = require('../libs/connection');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    unique: 'Не уникальное значение {PATH}',
    required: 'не заполнено обязательное поле {PATH}',
  },
  tplFileName: {
    type: String,
    unique: 'Не уникальное значение {PATH}',
    required: 'не заполнено обязательное поле {PATH}',
  },
  title: String,
  description: String,
}, {
  timestamps: true,
});

module.exports = connection.model('TemplatePage', Schema);
