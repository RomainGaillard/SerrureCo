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
            collection:'Lock',
            via:'groups'
        },
        groupUsers:{
            collection:'GroupUser',
            via:'group'
        }
    }
};