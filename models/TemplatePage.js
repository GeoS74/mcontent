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
  alias: {
    type: String,
    unique: 'Не уникальное значение {PATH}',
    required: 'не заполнено обязательное поле {PATH}',
  },
  meta: {
    title: String,
    description: String,
  },
  title: String,
  description: String,
}, {
  timestamps: true,
});

module.exports = connection.model('TemplatePage', Schema);
