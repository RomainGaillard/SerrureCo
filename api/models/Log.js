/**
* Log.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      message: {
          type: 'string',
          required: true
      },
      lock:{
          model: 'lock',
          columnName: 'lock_id'
      },
      user:{
          model: 'user',
          columnName: 'user_id'
      }
  },
    Log : function() {}
};

