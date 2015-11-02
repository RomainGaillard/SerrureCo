/**
 * Created by Romain Gaillard on 23/10/2015.
 */
var groupModel = require('../models/Group.js');
var groupUserModel = require('../models/GroupUser.js');

module.exports = {
    create: function(req,res){
        groupModel.name = req.param('name');
        sails.log.debug("Creation GROUP: "+groupModel.name);
        groupModel.locks = req.param('locks');

        Group.query('SELECT MAX(id) as lastId FROM `group`', function(err, results) {
            if (err){
                sails.log.debug("create Group: Error: Impossible de recuperer le LAST ID GROUP");
                return res.badRequest("create Group:  Error: Impossible de recuperer le LAST ID GROUP : "+err);
            }

            var lastId = results[0].lastId;
            var code = ToolsService.generateCode(lastId+1);
            Group.create({name:groupModel.name,code:code,locks:groupModel.locks}).exec(function(err, group){
                if(err){
                    sails.log.debug('create Group: Error: Fail create group !');
                    return res.badRequest('create Group:  Error: Fail create group ! :' + err);
                }
                sails.log.debug('create Group: Success: Group was successfully created !');
                console.log(group);
                groupUserModel.user = req.passport.user.id;
                groupUserModel.group = group.id;
                groupUserModel.admin = true;
                groupUserModel.validate = true;
                GroupService.createGroupUser(groupUserModel,function(err,groupUser){
                    if(err)
                        return res.badRequest("create Group: "+err);
                    return res.status(203).json({created:group,groupUser:groupUser});
                })

            });
        });
    },
    join: function(req,res){
        // Le createur du groupe ajoute des membres.
        var codeGroup = req.param('code');
        GroupService.findByCode(codeGroup,function(err,group){
            if(err)
                return res.badRequest("join group: "+err);

            groupUserModel.group = group.id;
            groupUserModel.user = req.passport.user.id;
            GroupService.checkIsAdmin(groupUserModel,function(err,admin){
                if(err)
                    return res.badRequest("join group: "+err);
                if(admin){
                    groupUserModel.user = req.param('user_id');
                    groupUserModel.admin = req.param('admin');
                    groupUserModel.validate = true;
                    GroupService.createGroupUser(groupUserModel,function(err,groupUser){
                        if(err)
                            return res.badRequest("join group: The user hasn't been added to the group :"+err);
                        return res.ok("join group:  The user has been added to the group : " + groupUser);
                    })
                }
                sails.log.debug("join group: Error: User has no right to do this action.");
                return res.badRequest("join group: Error: User has no right to do this action.");
            })
        });
    },
    destroy: function(req,res){
        // Vérifier que c'est bien l'admin du groupe !
        var codeGroup = req.param("code");
        GroupService.findByCode(codeGroup,function(err,group){
            if(err)
                return res.badRequest("destroy: "+err);
            groupUserModel.group = group.id;
            groupUserModel.user = req.passport.user.id;
            GroupService.checkIsAdmin(groupUserModel,function(err,admin){
                if(err)
                    res.badRequest("destroy group: "+err);
                else{
                    if(admin){
                        Group.destroy({id:groupUserModel.group}).exec(function(err){
                            if(err){
                                sails.log.debug("destroy group: Error: The group can't be deleted.");
                            }else{
                                sails.log.debug("destroy group: Success: The group was deleted.");
                                res.ok("destroy group: Success: The group was deleted.")
                                GroupService.destroyGroupUserbyGroup(groupUserModel.group,function(err){
                                    if(err)
                                        return res.basRequest("destroy group"+err);
                                    return res.ok("destroy group: Success: The GroupUser was deleted.")
                                })
                            }
                        });
                    }else{
                        sails.log.debug("destroy group: Error: User has no right to do this action.")
                        res.badRequest("destroy group: Error: User has no right to do this action.")
                    }
                }
            });
        })
    },
    giveRight: function(req,res){
        var codeGroup = req.param('code');
        var email = req.param('email');
        GroupService.updateGroupUser(codeGroup,req.passport.user.id,email,function(err,success){
            if(err)
                return res.basRequest("giveRight group: "+err);
            return res.ok("giveRight group"+success);
        });
    },
    askAccess: function(req,res){
        var codeGroup = req.param('code');
        // Récupérer l'id du groupe en fonction de son code.
        GroupService.findByCode(codeGroup,function(err,group){
            if(err)
                return res.badRequest("askAccess group: "+ err);
            groupUserModel.group = group.id;
            groupUserModel.user = req.passport.user.id;
            GroupService.checkIfGroupUserExist(groupUserModel,function(err,exist){
                if(err)
                    return res.badRequest("askAccess group: "+err);
                if(exist){
                    sails.log.debug("askAccess group: Error: Link already existing !");
                    return res.badRequest("askAccess group: Error: Link already existing !")
                }
                GroupService.createGroupUser(groupUserModel,function(err,groupUser){
                    if(err)
                        return res.badRequest("askAccess group: Error: The request for join group fail !" + err);
                    return res.ok("askAccess group: Success: The request for join group has been register !" + groupUser);
                })
            })
        });
    },
    giveAccess: function(req,res){
        var codeGroup = req.param('code');
        var email = req.param('email');
        GroupService.updateGroupUser(codeGroup,req.passport.user.id,email,function(err,success){
            if(err)
                return res.badRequest("giveAccess group: "+err);
            return res.ok("giveAccess group: "+success);
        })
    },
    exit: function(req,res){
        var codeGroup = req.param('code')
        GroupService.findByCode(codeGroup,function(err,group){
            if(err)
                return res.badRequest("exit group: "+err);
            groupUserModel.group_id = group.id;
            groupUserModel.user_id = req.passport.user.id;
            GroupService.destroyGroupUserbyUserAndGroup(groupUserModel,function(err,success){
                if(err)
                    return res.badRequest("exit group: "+err);
                return res.ok("exit group: "+success);
            })
        })
    }
};

