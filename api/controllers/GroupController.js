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
                    return res.status(201).json({created:group,groupUser:groupUser});
                })

            });
        });
    },
    join: function(req,res){
        // Le createur du groupe ajoute des membres.
        var codeGroup = req.param('code');
        GroupService.findByCode(codeGroup,function(err,group){
            if(err || group === undefined)
                return res.badRequest("join group: "+err);

            groupUserModel.group = group.id;
            groupUserModel.user = req.passport.user.id;
            GroupService.checkIsAdmin(groupUserModel,function(err,admin){
                if(err)
                    return res.badRequest("join group: "+err);
                if(admin){
                    User.findOne({email:req.param("email")}).exec(function(err,user){
                        if(err || user === undefined){
                            sails.log.debug("join group: Error: Can't find user email !");
                            return res.badRequest("join group: Error: Can't find user email !");
                        }
                        groupUserModel.user = user.id;
                        groupUserModel.admin = req.param('admin');
                        groupUserModel.validate = true;
                        GroupService.createGroupUser(groupUserModel,function(err,groupUser){
                            if(err)
                                return res.badRequest("join group: The user hasn't been added to the group :"+err);
                            return res.ok({message:"join group:  The user has been added to the group : ",groupUser:groupUser});
                        })
                    })
                }
                else{
                    sails.log.debug("join group: Error: User has no right to do this action.");
                    return res.badRequest("join group: Error: User has no right to do this action.");
                }
            })
        });
    },
    destroy: function(req,res){
        // V�rifier que c'est bien l'admin du groupe !
        var codeGroup = req.param("code");
        GroupService.findByCode(codeGroup,function(err,group){
            if(err || group === undefined)
                return res.badRequest("destroy: "+err);
            groupUserModel.group = group.id;
            groupUserModel.user = req.passport.user.id;
            GroupService.checkIsAdmin(groupUserModel,function(err,admin){
                if(err)
                    return res.badRequest("destroy group: "+err);
                if(admin){
                    Group.destroy({id:groupUserModel.group}).exec(function(err){
                        if(err) {
                            sails.log.debug("destroy group: Error: The group can't be deleted. :" + err);
                            return res.badRequest("destroy group: Error: The group can't be deleted. :" + err);
                        }
                        sails.log.debug("destroy group: Success: The group was deleted.");
                        GroupService.destroyGroupUserbyGroup(groupUserModel.group,function(err){
                            if(err)
                                return res.basRequest("destroy group: "+err);
                            return res.ok("destroy group: Success: The Group and the GroupUser was deleted.")
                        })
                    });
                }
                else{
                    sails.log.debug("destroy group: Error: User has no right to do this action.")
                    return res.badRequest("destroy group: Error: User has no right to do this action.")
                }
            });
        })
    },
    askAccess: function(req,res){
        var codeGroup = req.param('code');
        // R�cup�rer l'id du groupe en fonction de son code.
        GroupService.findByCode(codeGroup,function(err,group){
            if(err || group === undefined)
                return res.badRequest("askAccess group: "+ err);
            groupUserModel.group = group.id;
            groupUserModel.user = req.passport.user.id;
            GroupService.createGroupUser(groupUserModel,function(err,groupUser){
                if(err)
                    return res.badRequest("askAccess group: Error: The request for join group fail !" + err);
                return res.ok({message:"askAccess group: Success: The request for join group has been register !",groupUser:groupUser});
            })
        });
    },
    giveAccess: function(req,res){
        var codeGroup = req.param('code');
        var email = req.param('email');
        var giveAdmin = req.param('admin');
        if(giveAdmin === undefined)
            giveAdmin = false;
        GroupService.updateGroupUser(codeGroup,req.passport.user.id,email,giveAdmin,function(err,success){
            if(err)
                return res.badRequest("giveAccess group: "+err);
            return res.ok({message:"giveAccess group: ",groupUser:success});
        })
    },
    exit: function(req,res){
        var codeGroup = req.param('code')
        GroupService.findByCode(codeGroup,function(err,group){
            if(err || group === undefined)
                return res.badRequest("exit group: "+err);
            groupUserModel.group = group.id;
            groupUserModel.user = req.passport.user.id;
            GroupService.destroyGroupUserbyUserAndGroup(groupUserModel,function(err,success){
                if(err)
                    return res.badRequest("exit group: "+err);
                return res.ok("exit group: "+success);
            })
        })
    },
    exclude:function(req,res){
        var codeGroup = req.param("code");
        var email = req.param("email");
        User.findOne({where:{email:email}}).exec(function(err,user){
            if(err || user === undefined)
                return res.badRequest("exclude: Error: Can't find email user");
            GroupService.findByCode(codeGroup,function(err,group){
                if(err || group === undefined)
                    return res.badRequest("exclude: "+err);
                groupUserModel.group = group.id;
                groupUserModel.user = user.id;
                GroupService.destroyGroupUserbyUserAndGroup(groupUserModel,function(err,success){
                    if(err)
                        return res.badRequest("exclude group: "+err);
                    return res.ok("exclude group: "+success);
                })
            })
        })
    },
    edit:function(req,res){
        var codeGroup = req.param('code');
        var name  = req.param("name");
        Group.findOne({code:codeGroup}).exec(function(err,group){
            if(err || group === undefined){
                sails.log.debug("edit group: Error: The group code not found !");
                return res.badRequest("edit group: Error: The group code not found ! :"+err);
            }
            group.name = name;
            group.save(function(err){
                if(err){
                    sails.log.debug("edit group: Error: Can't save group. :"+ err);
                    return res.badRequest("edit group: Error: Can't save group :"+ err);
                }
                sails.log.debug("edit group: Success: group has been modified !");
                console.log(group);
                return res.ok({message:"edit group: Success: group has been modified !",group:group});
            })
        })
    },
    group:function(req,res){
        GroupUser.find({user:req.passport.user.id}).populate('group').exec(function(err,group){
            if(group){
                sails.log.debug("group: Success: "+group);
                return res.ok(group);
            }
            sails.log.debug("group: Error:"+err);
            return res.badRequest("group: Error:"+err);
        })
    },
    addLock:function(req,res){
        var codeGroup = req.param("code");
        GroupService.findByCode(codeGroup,function(err,group){
            if(group){
                groupUserModel.group = group.id;
                groupUserModel.user = req.passport.user.id;
                GroupService.checkIsAdmin(groupUserModel,function(err,admin){
                    if(err)
                        return res.badRequest("addLock:"+err);
                    if(admin)
                        return res.redirect("/group/"+group.id+"/lock/add/"+req.param('id'));
                    else{
                        sails.log.debug("addLock: Error: User has no right to do this action.");
                        return res.badRequest("addLock: Error: User has no right to do this action.");
                    }
                })
            }else{
                sails.log.debug("addLock: Error:"+err);
                return res.badRequest("addLock: Error:"+err);
            }
        })
    },
    removeLock:function(req,res){
        var codeGroup = req.param("code");
        GroupService.findByCode(codeGroup,function(err,group){
            if(group){
                groupUserModel.group = group.id;
                groupUserModel.user = req.passport.user.id;
                GroupService.checkIsAdmin(groupUserModel,function(err,admin){
                    if(err)
                        return res.badRequest("removeLock:"+err);
                    if(admin)
                        return res.redirect("/group/"+group.id+"/lock/remove/"+req.param("id"));
                    else{
                        sails.log.debg("removeLock: Error: User has no right to do this action.");
                        return res.badRequest("removeLock: Error: User has no right to do this action.");
                    }
                })
            }
            sails.log.debug("removeLock: Error: Group not found. :"+err);
            return res.badRequest("removeLock: Error: Group not found. :"+err);
        })
    },
    users:function(req,res) {
        var codeGroup = req.param("code");
        GroupService.findByCode(codeGroup,function(err,group){
            if(group){
                User.find().populate("groupUsers",{group:group.id}).exec(function(err,users){
                    if(users){
                        sails.log.debug({message: 'Success:',users:users})
                        return res.ok({message: 'Success:',users:users})
                    }
                    sails.log.debug("user Group: Error: "+err);
                    return res.badRequest("user Group: Error: "+err);
                })
            }
            else{
                sails.log.debug("user Group: Error: group not found. :"+err)
                return res.badRequest("user Group: Error: group not found. :"+err);
            }
        })
    },
    lock:function(req,res){
        var codeGroup = req.param("code");
        GroupService.findByCode(codeGroup,function(err,group){
            if(group)
            {
                // VERIF VALIDATE USER in GROUP !!!!!

                Lock.find().populate('groups',{group_locks:group.id}).exec(function(err,lock){
                    if(group){
                        sails.log.debug("lock Group: Success: "+lock);
                        return res.ok(lock);
                    }
                    sails.log.debug("lock Group: Error:"+err);
                    return res.badRequest("lock Group: Error:"+err);
                })
            }
            else{
                sails.log.debug("lock Group: Error: "+err);
                return res.badRequest("lock: Error: "+err)
            }
        })
    }
    /*/,
    getMyGroups: function(req,res){
        if(!req.isSocket){
            return res.json(401,{err:'is not a socket request'});
        }
        var userId = req.param('id');
        // find groups .exec(function(err,groups)
        Group.subscribe(req, _.pluck(groups,'id'))
        return res.json(groups)
    }
    */
};
