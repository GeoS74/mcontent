const mongoose = require('mongoose');
const connection = require('../libs/connection');

const Schema = new mongoose.Schema({
  fileName: String,
}, {
  timestamps: true,
});

module.exports = connection.model('Price', Schema);
