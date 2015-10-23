/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true
        },
        firstname: {
            type: 'string',
            defaultsTo: 'Account',
        },
        lastname: {
            type: 'string',
            defaultsTo: 'Unnamed',
        },
        groups:{
            collection:'GroupUser',
            via:'group'
        },
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },

    beforeCreate: function(user, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                }else{
                    user.password = hash;
                    cb(null, user);
                }
            });
        });
    }
};