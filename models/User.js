// модель коллекции пользователей
//
const mongoose = require('mongoose');
const connection = require('../libs/connection');

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: 'не заполнено обязательное поле {PATH}',
    unique: 'Не уникальное значение {PATH}',
  },
  name: String,
  photo: String,
  fullName: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

/**
 * создание и обновление поля fullName пользователя
 */
Schema.pre('save', setFullName);

function setFullName() {
  this.fullName = getFullName.call(this);
}

function getFullName() {
  return (`${this.name || ''} ${this.email}`).trim();
}

module.exports = connection.model('User', Schema);

// справочно: пример использования middleware для 'findOneAndUpdate'
//
// Schema.pre('findOneAndUpdate', updateFullName);
// function updateFullName() {
//   const email = this.getFilter()?.email;
//   const name = this.getUpdate()?.name;

//   this.setUpdate({
//     fullName: getFullName.call({ email, name }),
//     ...this.getUpdate(),
//   });
// }
