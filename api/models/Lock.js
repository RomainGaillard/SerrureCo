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
        address_mac:{
            type: 'string',
            unique: true,
            required:true,
            columnName: 'address_mac'
        },
        state:{
            type: 'boolean',
            defaultsTo:'false'
        },
        has_camera:{
            type:'boolean',
            defaultsTo:'false',
            columnName: 'has_camera'
        },
        has_bell:{
            type:'boolean',
            defaultsTo:'false',
            columnName: 'has_bell'
        },
        has_micro:{
            type:'boolean',
            defaultsTo:'false',
            columnName: 'has_micro'
        },
        planning:{
            type:'json'
        },
        is_register:{
            type:"boolean",
            defaultsTo:'true',
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