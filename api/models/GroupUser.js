/**
 * Created by Romain Gaillard on 23/10/2015.
 */


module.exports = {

    attributes: {
        user: {
            collection:'user',
            via:'id',
            columnName: 'user_id'
        },
        group:{
            collection:'group',
            via:'id',
            columnName: 'group_id'
        }
    }
};