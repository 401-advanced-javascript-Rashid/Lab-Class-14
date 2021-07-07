'use strict';

class Mongo {
  constructor(schema){
    this.schema = schema ;
  }
    
  read(name){
    if(name){
      return this.schema.find({name});
    }else{
      return this.schema.find({});
    }
  }
  create(value){
    let newValue = new this.schema(value);
    return newValue.save();
  }
  update(_id , value){
    return this.schema.findByIdAndUpdate(_id , value , {new : true});
  }
  delete(_id){
    return this.schema.findOneAndDelete(_id); 
  }
}


module.exports = Mongo ;