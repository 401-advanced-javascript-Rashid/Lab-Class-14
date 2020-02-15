'use strict';


require('dotenv').config();

const superagent = require('superagent');
const users = require('../user/users.js');

async function getToken(code){

  let resGitHub = await superagent.post('https://github.com/login/oauth/access_token')
    .send({
      code: code ,
      client_id: '82c0642983c60f165081',
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: 'http://localhost:3005/oauth',
      state: 'sleepy',
    });
  return resGitHub.body.access_token;
}

async function getInfo(access_token){
  let info = await superagent.get('https://api.github.com/user')
    .set('user-agent' , 'express-app')
    .set('Authorization' , `token ${access_token}`);

  return info.body ;
}

async function backTheInfoAfterSave(info){
  let userData = {
    name : info.login ,
    password : 'ToTo',
  };
  
  return [ await users.checkAndSave(userData),
    await users.tokenGenerator(userData) ];
}


module.exports= async function theDealer(req , res , next){
  try{
    let code = req.query.code ;
    let theToken = await getToken(code) ;
    let theInfo = await getInfo(theToken) ;
    let UserInfo = await backTheInfoAfterSave(theInfo);
    let token = UserInfo[1] ;
    let user = UserInfo[0] ;
    req.token = token ;
    req.user = user ;
    next();
  }catch(error){
    console.error(error);
  }
};