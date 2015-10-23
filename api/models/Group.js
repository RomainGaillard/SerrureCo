/**
 * Created by Romain Gaillard on 23/10/2015.
 */


module.exports = {

    attributes: {
        name: {
            type: 'string',
            defaultsTo:'Default'
        },
        code:{
            type: 'string',
            unique:true,
            required:true
        },
        locks:{
            collection:'lock',
            via:'groups'
        },
        users:{
            collection:'GroupUser',
            via: 'user'
        }
    }
};