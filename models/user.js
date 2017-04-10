var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  vardas: {
	  type: String,
	  required: true,
	  unique: true
  },
  emailas: {
	  type: String,
	  required: true,
	  unique: true
  },
  pass: {
        type: String,
        required: true
    },
  rol: String,
  registered: String,
  pakeistas: String
});

const users = module.exports = mongoose.model('users', schema);