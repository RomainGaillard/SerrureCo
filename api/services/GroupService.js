/**
 * Created by Romain Gaillard on 23/10/2015.
 */

module.exports = {
    /*
    create: function(group, callback){
        Group.query('SELECT MAX(id) as lastId FROM `group`', function(err, results) {
            if (err){
                sails.log.debug("Impossible de recuperer le LAST ID GROUP");
            }
            else{
                var lastId = results[0].lastId;
                var code = ToolsService.generateCode(lastId+1);
                Group.create({name:group.name,code:code,locks:group.locks}).exec(function(err, group){
                    sails.log.debug(group);
                    if (group) {
                        console.log('Group was successfully created !');
                        callback(false);
                    } else {
                        console.log('Fail create group !');
                        callback(true);
                    }
                });
            }
        });
    },
    join: function(groupUser, callback){
        GroupUser.create({user:groupUser.user,group:groupUser.group,admin:groupUser.admin}).exec(function(err,groupUser){
            sails.log.debug(groupUser);
            if(groupUser){
                console.log("The request for join group has been register !");
                callback(false);
            }else{
                console.log("The request for join group fail !")
                callback(true);
            }
        })
    },*/
    findByCode:function(code){

    },
    exit: function(code){
        Group.findBy({code:codeGroup}).populate("id").exec(function(err,wishes){
            //
        })
    },
    remove: function(code){

    },
    giveRight: function(code,email){

    },
    giveAccess: function(){

    }
};
