'use strict';

const schema = require('../user/users-schema.js');
const Mongo = require('../mongo.js');

class UserModel extends Mongo{
  constructor(){
    super(schema);
  }
}
module.exports= new UserModel ;