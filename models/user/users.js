'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Model = require('./user-model.js');
let users = {};


users.checkAndSave = async function (info){
  let result = await Model.read(info.name);
  let search;
  if(result[0]){
    search =result[0].name ;
  }

  if(!( search === info.name)){
    info.password = await bcrypt.hash(info.password , 10);
    await Model.create(info);
    return info ;
  }else{
    return info;
  }
};

users.tokenGenerator = async function(data){
  try{
    let token = await jwt.sign({user: `${data.name}`}, 'SECRET' , {expiresIn: '18m'}) ;
    return token ;
  }catch(error){
    return Promise.reject(error);
  }
};

users.basicAuth = async function(user , pass){
  let readDataBass = await Model.read(user);
  let check = await bcrypt.compare(pass , readDataBass[0].password);
  if(check){
    return readDataBass[0];
  }else{
    return Promise.reject ;
  }
};

users.getAll = async function(){
  return Model.read();
};

users.tokenValidator= async function(token){
  try {
    let info = await jwt.verify(token , 'SECRET');
    let searchResult = await Model.read(info.user);
    if(searchResult[0]){
      return searchResult[0];
    }else{
      return 'Wrong Access';
    }
  }catch(error){
    return Promise.reject(error); 
  }
};


module.exports = users ;