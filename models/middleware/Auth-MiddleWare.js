'use strict';


const base64 = require('base-64');
const users = require('../user/users.js');

module.exports =async (req , res , next) => {

  if(!req.headers.authorization){
    next();
  }
  let info = req.headers.authorization.split(' ').pop();
  let [user , password] = base64.decode(info).split(':');

  users.basicAuth(user , password)
    .then(result => {
      return users.tokenGenerator(result);
    })
    .then(info => {
      req.token = info;
      next();
    })

    .catch(error => next(error));

};