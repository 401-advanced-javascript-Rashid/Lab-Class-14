'use strict' ;

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const user = require('../models/user/users.js');
const server = express();

server.use(express.json());
server.use(express.static('./public'));
server.use(timeStamp);
server.use(logger); 
server.use(errorHandler);


const ACI = require('../models/middleware/ACI-MiddleWare.js');
const Auth = require('../models/middleware/Auth-MiddleWare.js');
const OAuth = require('../models/middleware/OAuth-MiddleWare.js');
const Bearer = require('../models/middleware/Bearer-Auth-MiddleWare.js');


server.use(cors());
server.use(morgan('dev'));

function timeStamp(req, res, next){
  let time = new Date();
  let reqTime = time.toUTCString();
  req.requestTime = reqTime ;
  next();
}

function logger(req, res, next) {
  console.log('request path:', req.path, ' method:', req.method, ' request time:', req.requestTime);
  next();
}

function errorHandler(err, req, res, next){
  res.status(500);
  res.statusMessage = 'Server Down (500)';
  res.json({error : err});
}

function notFoundHandler(req, res, next){
  res.status(404);
  res.statusMessage = '(404)';
  res.json({error : 'Not Found'});
}


server.post('/signup', signUp);
function signUp(req, res){

  return user.checkAndSave(req.body)
    .then(info => {
      return user.tokenGenerator(info);
    })
    .then(info => {
      res.status(200).send(`Your Token : ${info}`);
    });
}


server.post('/signin', Auth, signIn);
function signIn (req , res){
  res.status(200).send(req.token);
}


server.get('/getall', getAllUsers);
async function getAllUsers (req , res){
  let all = await user.getAll();
  res.status(200).send(`${all}`);
}


server.get('/oauth', OAuth, reqToken);
function reqToken(req , res){
  res.status(200).send(`Your Token : ${req.token}`);
}

server.get('/secret', Bearer, (req, res) => {
  if(req.userName){
    res.status(200).send(`Your Info : ${req.userName}`);
  }else{
    res.send('Wrong Access !');
  }
  
});


server.get('/readonly', Bearer, ACI('read'), (req, res) => {
  res.status(200).send('Access : Read');
});

server.get('/create', Bearer, ACI('create'), (req, res) => {
  res.status(200).send('Access : Create');
});

server.get('/update', Bearer, ACI('update'), (req, res) => {
  res.status(200).send('Access : Update');
});

server.get('/delete', Bearer, ACI('update'), (req, res) => {
  res.status(200).send('Access : Delete');
});

server.get('/everything', Bearer, ACI('superuser'), (req, res) => {
  res.status(200).send('Access : All');
});

server.get('*' , notFoundHandler);

module.exports = {
  server : server ,
  start : port => {
    let PORT = port || process.env.PORT || 3005 ;
    server.listen(PORT , () => {
      console.log(`listening to ${PORT}`);
    });
  },
};