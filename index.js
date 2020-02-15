'use strict' ;


const server = require('./lib/server.js');
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/lab14';
//lab1111

const mongooseOptions = {
  useNewUrlParser: true ,
  useCreateIndex: true ,
  useUnifiedTopology: true,
  useFindAndModify: true,
};

mongoose.connect( MONGODB_URI , mongooseOptions).catch(err => console.log(err));

server.start();