'use strict';


module.exports = (license => {

  return (req , res , next) => {

    try{
      if(!req.userName){
        res.send('User Information Undefined');
        next();
        return;
      }      
      if(req.userName.license){
        
        if(req.userName.license.includes(license)){
          next();
          return;
        }else{
          next('Not Invited');
        }
      }else{
        next('User Is Not Defined');
        return ;
      }

    }catch(error){
      next(error);
      return;
    }

  };
});