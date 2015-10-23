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
        }
    }
};