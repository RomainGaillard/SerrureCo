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
                sails.log.debug("Error: Impossible de recuperer le LAST ID GROUP");
            }
            else{
                var lastId = results[0].lastId;
                var code = ToolsService.generateCode(lastId+1);
                Group.create({name:groupModel.name,code:code,locks:groupModel.locks}).exec(function(err, group){
                    sails.log.debug(group);
                    if (group) {
                        sails.log.debug('Success: Group was successfully created !');
                        //res.status(203).json({created:group});
                        res.redirect('/group/join?code='+group.code+'&admin=true');
                    } else {
                        sails.log.debug('Error: Fail create group !');
                        res.badRequest(err);
                    }
                });
            }
        });
    },
    join: function(req,res){
        var codeGroup = req.param('code');
        // Récupérer l'id du groupe en fonction de son code.
        GroupService.findByCode(codeGroup,function(err,group){
            if(err){
                sails.log.debug("Error: The code group not exit !")
                res.badRequest("Error: The code group not exit !");
            }
            else{
                groupUserModel.group = group.id;
                groupUserModel.user = req.passport.user.id;
                groupUserModel.admin = req.param('admin');
                GroupUser.find({ where : {group: groupUserModel.group,user:groupUserModel.user}}).exec(function (err, group){
                        if(group){
                            if(group.length<=0){
                                // On fait la demanque de rejoindre le groupe que si le lien n'existe pas dans la table GroupUser.
                                GroupUser.create({user:groupUserModel.user,group:groupUserModel.group,admin:groupUserModel.admin}).exec(function(err,groupUser){
                                    sails.log.debug(groupUser);
                                    if(groupUser){
                                        sails.log.debug("Success: The request for join group has been register !");
                                        res.ok(groupUser);
                                    }else{
                                        sails.log.debug("Error: The request for join group fail !")
                                        res.badRequest(err);
                                    }
                                })
                            }
                            else{
                                res.badRequest("Error: Link already existing !");
                                sails.log.debug("Error: Link already existing !");
                            }
                        }
                        else{
                            res.badRequest("Error - Can't check if link exist in the Group_User table :"+err);
                            sails.log.debug("Error - Can't check if link exist in the Group_User table :"+err);
                        }
                    });
            }
        });
    },
    destroy: function(req,res){
        // Vérifier que c'est bien l'admin du groupe !
        groupUserModel.group = req.param('id');
        groupUserModel.user = req.passport.user.id;

        GroupService.checkIsAdmin(groupUserModel,function(err,admin){
            if(err){
                sails.log.debug("Error: Can't check if user is admin of the group."+err);
                res.badRequest("Error: Can't check if user is admin of the group."+err);
            }else{
                if(admin){
                    Group.destroy({id:groupUserModel.group}).exec(function(err){
                        if(err){
                            sails.log.debug("Error: The group can't be deleted.");
                        }else{
                            sails.log.debug("Success: The group was deleted.");
                            res.ok("Success: The group was deleted.")
                            GroupUser.destroy().exec();
                            GroupUser.destroy({group_id:groupUserModel.group}).exec(function(err){
                                if(err){
                                    sails.log.debug("Error: The GroupUser couldn't be deleted after Group.destroy");
                                }
                                else{
                                    sails.log.debug("Success: The GroupUser was deleted.")
                                }
                            })
                        }
                    });
                }else{
                    sails.log.debug("Error: User has no right to do this action.")
                    res.badRequest("Error: User has no right to do this action.")
                }
            }
        });

        /*
        GroupService.findByCode(codeGroup,function(err,group){

        });*/
    },
    giveRight: function(req,res){
        var codeGroup = req.param('code')
        var email = req.param('email')
        GroupeService.giveRight(codeGroup,email)
    },
    giveAccess: function(req,res){
        res.forbidden();
    },
    exit: function(req,res){
        var codeGroup = req.param('code')
        GroupeService.exitGroup(codeGroup)
    }
};

