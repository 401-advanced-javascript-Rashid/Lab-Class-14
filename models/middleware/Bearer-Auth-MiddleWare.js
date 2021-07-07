'use strict'; 

const users = require('../user/users.js');

module.exports = (req , res , next)=> {
    
  if(!req.headers.authorization){
    next(' Missing ( Authorization Data ) ');
    return ;
  }
  users.tokenValidator(req.headers.authorization.split(' ').pop())
    .then(data => {
      req.userName = data;
      next();
    }).catch(error => next(error));

};