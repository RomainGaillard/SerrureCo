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
          model: 'Lock',
          columnName: 'lock_id'
      },
      user:{
          model: 'User',
          columnName: 'user_id'
      }
  },
  Log : function() {},
  toArray : function() {
      return [
          this.message,
          this.lock.id,
          this.user.id,
          this.createdAt,
          this.updatedAt
      ]
  }
};

