/**
 * Created by Romain Gaillard on 23/10/2015.
 */


module.exports = {
    tableName: 'group_user',

    attributes: {
        user: {
            model:'user',
            via:'id',
            columnName: 'user_id'
        },
        group:{
            model:'group',
            via:'code',
            columnName: 'group_code'
        },
        validate:{
            type: 'boolean',
            defaultsTo:false
        },
        admin:{
            type: 'boolean',
            defaultsTo:false
        }

    }
};