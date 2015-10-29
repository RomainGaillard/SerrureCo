/**
 * Created by Romain Gaillard on 23/10/2015.
 * Lock: Modele de la serrure connectee.
 */

module.exports = {
    attributes: {
        name:{
            type: 'string',
            required: true
        },
        addressMac:{
            type: 'string',
            unique: true,
            columnName: 'address_mac'
        },
        state:{
            type: 'boolean'
        },
        hasCamera:{
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
        },
        planning:{
            type:'json'
        },
        isRegister:{
            type:"boolean",
            columnName: 'is_register'
        },
        logs:{
            collection: 'log',
            via: 'lock'
        },
        keyNFC_id:{
            collection:'KeyNFC',
            via: 'id'
        },
        groups:{
            collection:'group',
            via:'locks',
            type:'boolean'
        }
    }
};