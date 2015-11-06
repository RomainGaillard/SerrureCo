/**
 * Created by Romain Gaillard on 23/10/2015.
 * Lock: Modele de la serrure connectee.
 */

module.exports = {
    joinTableNames: {
        keyNFCs: 'locks_keynfcs'
    },
    attributes: {
        name:{
            type: 'string',
            required: true
        },
        addressMac:{
            type: 'string',
            unique: true,
            required:true,
            columnName: 'address_mac'
        },
        state:{
            type: 'boolean',
            defaultsTo:'false'
        },
        hasCamera:{
            type:'boolean',
            defaultsTo:'false',
            columnName: 'has_camera'
        },
        hasBell:{
            type:'boolean',
            defaultsTo:'false',
            columnName: 'has_bell'
        },
        hasMicro:{
            type:'boolean',
            defaultsTo:'false',
            columnName: 'has_micro'
        },
        planning:{
            type:'json'
        },
        isRegister:{
            type:"boolean",
            defaultsTo:'false',
            columnName: 'is_register'
        },
        logs:{
            collection: 'log',
            via: 'lock'
        },/*
        users:{
            collection:'User',
            via: 'locks',
        },*/
        groups:{
            collection:'Group',
            via:'locks'
        }
    }
};