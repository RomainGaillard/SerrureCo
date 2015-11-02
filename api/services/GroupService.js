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
    }*/
    findByCode:function(code,callback){
        Group.findOne({ where: { code: code }}).exec(function (err, group){
            if (group) {
                callback(null,group);
            } else {
                callback(err, null);
            }
        });
    },
    checkIsAdmin:function(groupUser,callback){
        GroupUser.findOne({where:{group:groupUser.group,user:groupUser.user}}).exec(function(err,groupUser){
            if(groupUser){
                callback(null,groupUser.admin)
            }
            else{
                callback(err,null);
            }
        })
    }

};
