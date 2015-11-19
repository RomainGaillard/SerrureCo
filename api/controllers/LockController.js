/**
 * Created by Romain Gaillard on 05/11/2015.
 */

/**
 * LuckController
 *
 * @description :: Server-side logic for managing lucks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var LockModel = require('../models/Lock.js');
var GroupUserModel = require('../models/GroupUser.js');

module.exports = {
    create: function(req,res){
        LockModel.name = req.param("name");
        LockModel.address_mac = req.param("address_mac");
        LockModel.state = req.param("state");
        LockModel.has_camera = req.param("has_camera");
        LockModel.has_bell = req.param("has_bell");
        LockModel.has_micro = req.param("has_micro");
        LockModel.planning = req.param("planning");
        LockModel.is_register = req.param("is_register");
        var groups = req.param('groups');
        LockModel.groups;

        var createLock = function(){
            Lock.create({name:LockModel.name,address_mac:LockModel.address_mac,state:LockModel.state,has_camera:LockModel.has_camera,
                has_bell:LockModel.has_bell,has_micro:LockModel.has_micro,planning:LockModel.planning,is_register:LockModel.is_register,groups:LockModel.groups}).exec(function(err,lock){
                if(lock){
                    sails.log.debug({message:"create Lock: Success: ",lock:lock});
                    return res.ok({message:"create Lock: Success !",lock:lock});
                }
                sails.log.debug("create Lock: Error:"+err);
                return res.badRequest("create Lock: Error:"+err);
            })
        }
        var addGroupAtLock = function(){
            if(groups){
                var groupsCode = new Array();
                // rechercher id des codes.

                if(groups[0].length <= 1)
                    groupsCode[0] = groups;
                else
                    groupsCode = groups;
                Group.find({code:groupsCode}).exec(function(err,groups){
                    if(groups){
                        // VERIFIER ADMIN !
                        var groupsId = "("
                        for(var j=0;j<groups.length;j++){
                            groupsId += groups[j].id;
                            if(j!=groups.length-1)
                                groupsId += ",";
                            else
                                groupsId += ")"
                        }
                        GroupUser.query('SELECT * FROM `group_user` WHERE `user_id` = '+req.passport.user.id+' AND `group_id` IN '+groupsId, function(err, results) {
                            if(results){
                                LockModel.groups = new Array();
                                for(var i=0;i<results.length;i++){
                                    if(results[i].admin){
                                        LockModel.groups[LockModel.groups.length] = results[i].group_id;
                                    }
                                    else
                                        sails.log.debug("Create Lock: WARNING: L'user "+req.passport.user.id+" a essayé d'ajouter le groupe "+results.group_id+" sans les droits.")
                                }
                                createLock();
                            }
                            else
                                return res.badRequest("create Lock: Error: "+err);
                        })
                    }
                    else{
                        sails.log.debug("create Lock: Error: Group not found "+err)
                        return res.badRequest("create Lock: Error: Group not found "+err);
                    }
                })
            }
            else{
                createLock();
            }
        }
        addGroupAtLock();
    },
    locks: function(req, res){
        var userId = req.passport.user.id;
        //Locks des groupes de l'user ou ce dernier est admin et ceci sans avoir de doublon
        var request = "SELECT `l`.id, `l`.name, `l`.address_mac, `l`.state, `l`.has_camera, `l`.has_bell,`l`.has_micro,`l`.is_register " +
            "FROM `lock` `l` " +
            "INNER JOIN `group_locks__lock_groups` `GL` ON `l`.id=`GL`.lock_groups " +
            "INNER JOIN `group` ON `GL`.group_locks=`group`.id " +
            "INNER JOIN `group_user` `GU` ON `group`.id=`GU`.group_id " +
            "WHERE `GU`.user_id = "+userId+" AND `GU`.admin = true GROUP BY `l`.id";
        Lock.query(request, function(err,locks){
            if (locks) {
                res.ok(locks);
            } else {
                res.badRequest(err);
                console.log(err);
            }
        })
    },
    update: function(req, res){
        Lock.findOne({where:{id:req.param("id")}}).exec(function (err, lock) {
            if(err) return res.badRequest(err);
            if(lock) {

                if(req.param("state") != null){
                    sails.log.debug(req.param("state"));
                    sails.log.debug(ToolsService.getBoolean(req.param("state")))
                    lock.state = ToolsService.getBoolean(req.param("state"));
                }

                if(req.param("has_camera") != null){
                    lock.has_camera = ToolsService.getBoolean(req.param("has_camera"));
                }

                if(req.param("has_bell") != null){
                    lock.has_bell = ToolsService.getBoolean(req.param("has_bell"));
                }

                if(req.param("has_micro") != null){
                    lock.has_micro = ToolsService.getBoolean(req.param("has_micro"));
                }

                if(req.param("is_register") != null){
                    lock.is_register = ToolsService.getBoolean(req.param("is_register"));
                }

                if(req.param("address_mac") != null){
                    if(!ToolsService.isEmpty(req.param("address_mac"))) {
                        lock.address_mac = req.param("address_mac");
                    }
                }

                lock.save(function(err) {
                    if(err) {
                        console.log("save----" + err)
                        return res.send(err.status, err);
                    }
                    Lock.publishUpdate(lock.id,{lock:lock})
                    return res.send(200, lock);
                });
            }
            else {
                return res.badRequest("Lock not exist");
            }
        });
    }
};

