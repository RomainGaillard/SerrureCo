/**
 * Created by Romain Gaillard on 23/10/2015.
 * Lock: Mod�le de la serrure connect�.
 */

module.exports = {
    attributes: {
        name:{
            type: "string",
            required: true
        },
        addressMac:{
            type: "string",
            unique: true
        },
        state:{
            type: "boolean"
        },
        hasCamera:{
            type:"boolean"
        },
        hasBell:{
            type:"boolean"
        },
        hasMicro:{
            type:"boolean"
        },
        planning:{
            type:"json"
        },
        isRegister:{
            type:"boolean"
        },
        logs:{
            collection: 'log',
            via: 'lock'
        }
    }

};