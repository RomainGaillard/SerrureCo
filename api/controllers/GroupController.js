/**
 * Created by Romain Gaillard on 23/10/2015.
 */
var groupModel = require('../models/Group.js');
var log = require('../models/Log.js');
var groupUserModel = require('../models/GroupUser.js');

module.exports = {
    create: function(req,res){
        groupModel.name = req.param('name');
        sails.log.debug("Creation GROUP: "+groupModel.name);
        groupModel.locks = req.param('locks');

        Group.query('SELECT MAX(id) as lastId FROM `group`', function(err, results) {
            if (err){
                sails.log.debug("create Group: Error: Impossible de recuperer le LAST ID GROUP");
                if(req.isSocket)
                    return res.status(400).json({err:"create Group:  Error: Impossible de recuperer le LAST ID GROUP : "+err})
                return res.badRequest("create Group:  Error: Impossible de recuperer le LAST ID GROUP : "+err);
            }

            var lastId = results[0].lastId;
            var code = ToolsService.generateCode(lastId+1);
            Group.create({name:groupModel.name,code:code,locks:groupModel.locks}).exec(function(err, group){
                if(err){
                    sails.log.debug('create Group: Error: Fail create group !');
                    if(req.isSocket)
                        return res.status(400).json({err:"create Group:  Error: Fail create group ! :"+err})
                    return res.badRequest('create Group:  Error: Fail create group ! :' + err);
                }
                sails.log.debug('create Group: Success: Group was successfully created !');
                console.log(group);
                groupUserModel.user = req.passport.user.id;
                groupUserModel.group = group.id;
                groupUserModel.admin = true;
                groupUserModel.validate = true;
                GroupService.createGroupUser(groupUserModel,function(err,groupUser){
                    if(err){
                        if(req.isSocket)
                            return res.status(400).json({err:"create Group:"+err})
                        return res.badRequest("create Group: "+err);
                    }

                    if(req.isSocket)
                        Group.subscribe(req, group.id);
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
                    return res.forbidden("join group: Error: User has no right to do this action.");
                }
            })
        });
    },
    destroy: function(req,res){
        // Vérifier que c'est bien l'admin du groupe !
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
                        sails.log.debug("destroy group: Success: The group was deleted.")
                        Group.publishDestroy(group.id)

                        GroupService.destroyGroupUserbyGroup(groupUserModel.group,function(err){
                            if(err){
                                sails.log.debug("destroy GroupUser ERROR "+err);
                                return res.badRequest("destroy group: "+err);

                            }
                            sails.log.debug("destroy GroupUser success");
                        })
                    });

                    var j = 0;
                    for(var i = 0; i < group.locks.length; i++){
                        Lock.findOne({id:group.locks[i].id}).populate('groups').exec(function(err,lock) {
                            if (err) {
                                return res.badRequest;
                                sails.log.debug(err);
                            }
                            if (lock.groups.length == 0){
                                Lock.destroy({id:lock.id}).exec(function(err) {
                                    if (err) return res.badRequest("can't delete lock from the database despite it's not left in any group");
                                })
                            }
                            j++;
                            // si on est bien passé le bon nombre de fois dans ce callback au dernier coup on a toujours pas eu d'erreur donc on renvoie ok
                            if(j == group.locks.length) return res.ok();
                        });
                    }
                    // si il n'y a pas de lock dans le groupe
                    if (group.locks.length == 0) return res.ok();

                }
                else{
                    sails.log.debug("destroy group: Error: User has no right to do this action.")
                    return res.forbidden("destroy group: Error: User has no right to do this action.")
                }
            });
        })
    },
    askAccess: function(req,res){
        var codeGroup = req.param('code');
        // Récupérer l'id du groupe en fonction de son code.
        GroupService.findByCode(codeGroup,function(err,group){
            if(err || group === undefined)
                return res.badRequest("askAccess group: "+ err);
            groupUserModel.group = group.id;
            groupUserModel.user = req.passport.user.id;
            groupUserModel.validate = false;
            groupUserModel.admin = false;
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
                return res.ok({msg:"exit group: "+success});
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
                    Group.publishUpdate(group.id,{exclude:true,codeGroup:group.code,email:email})
                    return res.ok({msg:"exclude group: "+success});
                })
            })
        })
    },
    edit:function(req,res){
        var codeGroup = req.param('code');
        var name  = req.param("name");
        GroupService.findByCode(codeGroup,function(err,group){
            if(err) {
                sails.log.debug(err);
                return res.badRequest(err);
            }
            if(group){
                groupUserModel.group = group.id;
                groupUserModel.user = req.passport.user.id;
                GroupService.checkIsAdmin(groupUserModel,function(err,admin){
                    if(err)
                        return res.badRequest("edit group:"+err);
                    if(admin) {
                        group.name = name;
                        group.save(function (err) {
                            if (err) {
                                sails.log.debug("edit group: Error: Can't save group. :" + err);
                                return res.badRequest("edit group: Error: Can't save group :" + err);
                            }
                            sails.log.debug("edit group: Success: group has been modified !");
                            console.log(group);
                            return res.ok({message: "edit group: Success: group has been modified !", group: group});
                        })
                    }
                    else{
                        sails.log.debug("edit group: Error: User has no right to do this action.");
                        return res.forbidden("edit group: Error: User has no right to do this action.");
                    }
                })
            }else{
                sails.log.debug("edit group: Error: No group found");
                return res.badRequest("edit group: Error: No group found");
            }
        })
    },
    group:function(req,res){
        GroupUser.find({user:req.passport.user.id}).populate('group').exec(function(err,group){
            if(group){
                sails.log.debug("group: Success: "+group);
                if(req.isSocket){
                    for(var i=0;i<group.length;i++){
                        Group.subscribe(req, group[i].group.id)
                    }
                    //Group.subscribe(req, _.pluck(group,'group_id'))
                    return res.status(200).json(group)
                }
                else
                    return res.ok(group);
            }
            sails.log.debug("group: Error:"+err);
            if(req.isSocket)
                return res.status(400).json({err:"group: Error:"+err});
            return res.badRequest("group: Error:"+err);
        })
    },
    findUnvalidUserInGroup: function (req, res) {
        var codeGroup = req.param("code");
        if(codeGroup === undefined) return res.badRequest("usersWait: No code group");
        GroupService.findByCode(codeGroup, function (err, group) {
            if(err) return res.badRequest("usersWait: Error: Code group not exist: "+err);
            if(group){
                GroupUser.find({group:group.id, validate:0}).exec(function(err,groupUser) {
                    if(err) return res.badRequest("usersWait:"+err);
                    var tabUser = [];
                    if(groupUser){
                        if(groupUser.length>0){
                            var j = 0;
                            for(var i=0; i<groupUser.length;i++){
                                User.findOne({id:groupUser[i].user}).exec(function(err,user){
                                    if(err) return res.badRequest("usersWait:"+ err);
                                    if(user)
                                        tabUser.push(user);
                                    j++;
                                    if(j == groupUser.length){
                                        return res.status(200).json({usersWait:tabUser});
                                        sails.log.debug({msg:"usersWait:",tabUser:tabUser})
                                    }
                                })
                            }
                        }
                        else{
                            sails.log.debug("usersWait: No user found")
                            return res.status(200).json({usersWait:tabUser});
                        }
                    }
                    else{
                        sails.log.debug("usersWait: No user found")
                        return res.status(200).json({usersWait:tabUser});
                    }

                })
            }else{
                sails.log.debug("usersWait: Error: No group found");
                return res.badRequest("usersWait: Error: No group found");
            }
        })
    },
    addLock:function(req,res){
        var codeGroup = req.param("code");
        GroupService.findByCode(codeGroup,function(err,group){
            if(err) {
                sails.log.debug(err);
                return res.badRequest(err);
            }
            if(group){
                groupUserModel.group = group.id;
                groupUserModel.user = req.passport.user.id;
                GroupService.checkIsAdmin(groupUserModel,function(err,admin){
                    if(err)
                        return res.badRequest("addLock:"+err);
                    if(admin){
                        group.locks.add(req.param("id"));
                        group.save(function (err) {
                            if (err) return res.badRequest(err);
                            log.message = "Ajout de la serrure au groupe "+group.name+" ";
                            log.lock    = req.param("id");
                            log.user    = req.passport.user.id;
                            LogService.create(log, function(isCreated){});
                            Group.publishUpdate(group.id,{addLock:true,group:group});
                            return res.ok();
                        })
                    }
                    else{
                        sails.log.debug("addLock: Error: User has no right to do this action.");
                        return res.forbidden("addLock: Error: User has no right to do this action.");
                    }
                })
            }else{
                sails.log.debug("addLock: Error: No group found");
                return res.badRequest("addLock: Error: No group found");
            }
        })
    },
    removeLock:function(req,res){
        var codeGroup = req.param("code");
        GroupService.findByCode(codeGroup,function(err,group){
            if (err) {
                sails.log.debug("removeLock: Error: Group not found. :"+err);
                return res.badRequest("removeLock: Error: Group not found. :"+err);
            }
            groupUserModel.group = group.id;
            groupUserModel.user = req.passport.user.id;
            GroupService.checkIsAdmin(groupUserModel,function(err,admin){
                if(err) {
                    return res.badRequest("removeLock:" + err);
                }
                if(admin){
                    group.locks.remove(req.param("id"));

                    group.save(function(err){
                        console.log(err);
                        if (err) return res.badRequest(err);
                        log.message = "La serrure a été enlevé du groupe "+group.name+" ";
                        log.lock    = req.param("id");
                        log.user    = req.passport.user.id;
                        LogService.create(log, function(isCreated){});

                        Lock.findOne({id:req.param("id")}).populate('groups').exec(function(err,lock) {
                            if (err) return res.badRequest;
                            if(lock){
                                if (lock.groups.length == 0){
                                    Lock.destroy({id:req.param("id")}).exec(function(err) {
                                        if (err) return res.badRequest("can't delete lock from the database despite it's not left in any group");
                                        Lock.publishDestroy(req.param("id"));
                                    })
                                }
                                Group.publishUpdate(group.id,{removeLock:true,lock:lock,group:group});
                                return res.ok();
                            }
                            else{
                                sails.log.debug("removeLock: Error: Can't find lock id"+req.param("id"));
                                return res.badRequest("Can't find lock id ! ");
                            }


                        });
                    });
                }
                else{
                    sails.log.debug("removeLock: Error: User has no right to do this action.");
                    return res.forbidden("removeLock: Error: User has no right to do this action.");
                }
            })
        })
    },
    users:function(req,res) {
        var codeGroup = req.param("code");
        GroupService.findByCode(codeGroup,function(err,group){
            if(group){
                sails.log.debug("---------------------------------------------------------------", group.id);

                var request = "SELECT `user_id`,`admin` FROM `group_user` WHERE `group_id` ="+group.id;
                    GroupUser.query(request, function(err, results) {
                    if (err) return res.serverError(err);
                    var j = 0;
                    var tabUser = [];
                    var isAdmin = [];
                        for(var i = 0; i < results.length; i++){
                            if(results[i].admin == 1)
                                isAdmin.push(true);
                            else
                                isAdmin.push(false);

                            User.findOne({id:results[i].user_id}).exec(function(err, user){
                                if (err) {
                                    sails.log.debug(err);
                                    return res.badRequest;
                                }
                                if(user){
                                    user.admin = isAdmin[tabUser.length];
                                    tabUser.push(user.toJSON());
                                }
                                j++;
                                if(j == results.length){
                                    sails.log.debug(tabUser)
                                    return res.ok({users:tabUser});
                                }
                            });
                        }
                        if (results.length == 0) return res.ok({users:tabUser});
                    });
                
/************************************************************************************************
                User.find().populate("groupUsers",{group:group.id}).exec(function(err,users){
                                        if(users){
                        //sails.log.debug({message: 'Success:',users:users})
                        return res.ok({message: 'Success:',users:users})
                    }
                    sails.log.debug("user Group: Error: "+err);
                    return res.badRequest("user Group: Error: "+err);
                })************************************************************************************/
            }
            else{
                sails.log.debug("user Group: Error: group not found. :"+err)
                return res.badRequest("user Group: Error: group not found. :"+err);
            }
        })
    },
    lock:function(req,res){
        var codeGroup = req.param("code");
        var userId    = req.passport.user.id;
        GroupService.findByCode(codeGroup, function(err,group){
            if(group)
            {
                for(var i =0; i < group.groupUsers.length; i++ )
                {
                    if (group.groupUsers[i].user == userId)
                    {
                        if(!group.groupUsers[i].validate)
                            return  res.forbidden("Acces denied! You are not validate by the administrateur of the group !");
                    }
                }
                var request = "SELECT `l`.id, `l`.name, `l`.address_mac, `l`.state, `l`.has_camera, `l`.has_bell,`l`.has_micro,`l`.is_register, " +
                    "`l`.createdAt, `l`.updatedAt " +
                    "FROM `lock` `l` " +
                    "INNER JOIN `group_locks__lock_groups` `lg` ON `l`.`id` = `lg`.`lock_groups` " +
                    "WHERE `group_locks`="+group.id;
                Lock.query(request, function(err,locks){

                    if(locks){
                        if(locks.length > 0){
                            for(var i = 0; i < locks.length; i++)
                            {
                                locks[i] = LockService.format(locks[i]);
                            }
                            sails.log.debug({msg:"lock Group: Success: ",lock:locks});
                            if(req.isSocket){
                                Lock.subscribe(req, _.pluck(locks,'id'))
                                return res.json(locks)
                            }
                            else
                                return res.ok(locks);
                        }
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

};
