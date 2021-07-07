'use strict';

const mongoose = require('mongoose');

const user = mongoose.Schema({
  name : {type : String , required : true},
  password : {type : String , required : true},
  license : {type : String , require : true , enum:['read' ,'create', 'update', 'superuser']},
});

module.exports = mongoose.model('user', user);