/**
* KeyNFC.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    name:{
    	type: 'string',
    	defaultsTo:'keyNFC_'
    },
    num:{
    	type:'integer',
        unique:true
    },
    owner:{
        model:'User',
        required:true,
        columnName: 'user_id'
    }
  }
};

