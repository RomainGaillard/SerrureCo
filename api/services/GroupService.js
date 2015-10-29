/**
 * Created by Romain Gaillard on 23/10/2015.
 */

module.exports = {

    createGroup: function(name, callback){
        Group.query('SELECT MAX(id) as lastId FROM `group`', function(err, results) {
            if (err){
                sails.log.debug("Impossible de recuperer le LAST ID GROUP");
            }
            else{
                var lastId = results[0].lastId;
                var code = ToolsService.generateCode(lastId+1);
                Group.create({name:name,code:code}).exec(function(err, group){
                    if (group) {
                        console.log('Group was successfully created ! CODE: '+code);
                        callback(false);
                    } else {
                        console.log('Fail create group !');
                        callback(true);
                    }
                });
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
