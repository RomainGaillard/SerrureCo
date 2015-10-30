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
                        console.log('Group was successfully created !');
                        res.ok(group);
                    } else {
                        console.log('Error: Fail create group !');
                        res.badRequest();
                    }
                });
            }
        });
    },
    join: function(req,res){
        var codeGroup = req.param('code');
        GroupService.findByCode(codeGroup,function(err,idGroup){
            if(err){
                sails.log.debug("Error: The code group not exit !")
            }
            else{
                groupUserModel.group = idGroup;
                groupUserModel.user = req.param('user_id');
                groupUserModel.admin = req.param('admin');

                GroupUser.create({user:groupUserModel.user,group:groupUserModel.group,admin:groupUserModel.admin}).exec(function(err,groupUser){
                    sails.log.debug(groupUser);
                    if(groupUser){
                        console.log("The request for join group has been register !");
                    }else{
                        console.log("Error: The request for join group fail !")
                    }
                })
            }
        });



    },
    exit: function(req,res){
        var codeGroup = req.param('code')
        GroupeService.exitGroup(codeGroup)
    },
    remove: function(req,res){
        var codeGroup = req.param('code')
        GroupeService.remove(codeGroup);
    },
    giveRight: function(req,res){
        var codeGroup = req.param('code')
        var email = req.param('email')
        GroupeService.giveRight(codeGroup,email)
    },
    giveAccess: function(req,res){
        res.forbidden;
    }
};

