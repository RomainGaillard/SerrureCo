/**
 * Created by Romain Gaillard on 23/10/2015.
 */

module.exports = {

    create: function(name){
        var code = "";
        Group.create({name:name,code:code}).exec(function(err,group){

        });
    },
    askAddGroup: function(code){
        Group.findBy({code:codeGroup}).populate("id").exec(function(err,wishes){

        })
    },
    exitGroup: function(code){
        Group.findBy({code:codeGroup}).populate("id").exec(function(err,wishes){
            //
        })
    },
    removegroup: function(code){

    },
    giveright: function(code,email){

    }
};
