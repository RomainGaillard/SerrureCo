/**
 * Created by Romain Gaillard on 23/10/2015.
 * Lock: Modèle de la serrure connecté.
 */

module.exports = {
    attributes: {
        name:{
            type: 'string',
            required: true
        },
        addressMac:{
            type: 'string',
<<<<<<< HEAD
            unique: true,
            columnName: 'address_mac'
=======
            unique: true
>>>>>>> origin/master
        },
        state:{
            type: 'boolean'
        },
        hasCamera:{
<<<<<<< HEAD
            type:'boolean',
            columnName: 'has_camera'
        },
        hasBell:{
            type:'boolean',
            columnName: 'has_bell'
        },
        hasMicro:{
            type:'boolean',
            columnName: 'has_micro'
=======
            type:'boolean'
        },
        hasBell:{
            type:'boolean'
        },
        hasMicro:{
            type:'boolean'
>>>>>>> origin/master
        },
        planning:{
            type:'json'
        },
        isRegister:{
<<<<<<< HEAD
            type:'boolean',
            columnName: 'is_register'
        },
        keyNFC_id:{
            collection:'KeyNFC',
            via: 'id'
        },
        groups:{
            collection:'group',
            via:'locks'
=======
            type:'boolean'
>>>>>>> origin/master
        }
    }
};