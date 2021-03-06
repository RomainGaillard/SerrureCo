var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username:{
        type: 'string',
        unique: true
    },
    email: {
        type: 'email',
        unique: true
    },
    firstname: {
        type: 'string',
        defaultsTo: 'Account'
    },
    lastname: {
        type: 'string',
        defaultsTo: 'Unnamed'
    },
    groupUsers:{
        collection:'GroupUser',
        via:'user' },/*
    locks:{
        collection:'Lock',
        va:'users'
    },*/
    keyNFCs:{
        collection: 'KeyNFC',
        via: 'owner'
    },
    passports : {
        collection: 'Passport',
        via: 'user'
    },

    toJSON: function() {
          var obj = this.toObject();
          delete obj.password;
          delete obj.id;
          delete obj.createdAt;
          delete obj.updatedAt;
          return obj;
    }
  }
};

module.exports = User;
/*

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
            defaultsTo: 'Account'
        },
        lastname: {
            type: 'string',
            defaultsTo: 'Unnamed'
        },
        groupUsers:{
            collection:'GroupUser',
            via:'user'
        },
        keynfcss:{
            collection: 'KeyNFC',
            via: 'owner'
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
*/
