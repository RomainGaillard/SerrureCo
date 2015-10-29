/**
 * Created by Romain Gaillard on 23/10/2015.
 */

module.exports = {

    createGroup: function(name, callback){
        var code = "67";
        return Group.create({name:name,code:code}).exec(function(err, group){
            if (group) {
                console.log('Group was successfully created !');
                callback(false);
            } else {
                console.log('Fail create group !');
                callback(true);
            }
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
