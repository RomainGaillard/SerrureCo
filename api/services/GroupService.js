/**
 * Created by Romain Gaillard on 23/10/2015.
 */

var groupUserModel = require('../models/GroupUser.js');

module.exports = {

    findByCode:function(code,callback){
        Group.findOne({ where: { code: code }}).populate('groupUsers').populate('locks').exec(function (err, group){
            if (group) {
                for(var i = 0; i < group.locks.length; i++)
                {
                    group.locks[i] = LockService.format(group.locks[i]);
                }
                callback(null,group);
            } else {
                sails.log.debug("findByCode group: Error: The code group not exist ! : " + err);
                callback("Error: The code group not exist ! :"+code +" "+ err, null);
            }
        });
    },
    checkIsAdmin:function(groupUser,callback){
        GroupUser.findOne({where:{group_id:groupUser.group,user_id:groupUser.user}}).exec(function(err,groupUser){
            if(groupUser)
                return callback(null, groupUser.admin)
            sails.log.debug("checkIsAdmin group: Error: Can't check if user is admin of the group. : "+err);
            return callback("Error: Can't check if user is admin of the group. : "+err,null);
        })
    },
    checkIfGroupUserExist:function(groupUserModel,callback){
        GroupUser.find({ where : {group_id: groupUserModel.group,user_id:groupUserModel.user}}).exec(function (err, group){
            if(group){
                if(group.length<=0)
                    return callback(null,false);
                return callback(null,true);
            }
            sails.log.debug("checkIfGroupUserExist: Error - Can't check if link exist in the Group_User table : "+err);
            return callback("Error - Can't check if link exist in the Group_User table : "+err,null);
        });
    },
    updateGroupUser:function(codeGroup,user_admin,email,giveAdmin,callback){
        GroupService.findByCode(codeGroup,function(err,group){
            if(err || group === undefined)
                return callback(err,null);
            groupUserModel.group = group.id;
            groupUserModel.user = user_admin;
            GroupService.checkIsAdmin(groupUserModel,function(err,admin){
                if(err)
                    return callback(err,null);
                if(admin){
                    User.findOne({email:email}).exec(function(err,user){
                        if(err || user === undefined){
                            sails.log.debug("updateGroupUser: Error: The email was not found :"+err);
                            return callback("Error: The email was not found :"+err,null);
                        }
                        GroupUser.findOne({where:{user_id:user.id,group_id:group.id}}).exec(function (err,groupUser){
                            if(err || groupUser === undefined){
                                sails.log.debug("updateGroupUser: Error: This user is not associated with this group. : "+err);
                                return callback("Error: This user is not associated with this group. : "+err,null);
                            }
                            groupUser.admin = giveAdmin;
                            groupUser.validate = true;
                            groupUser.save(function(err){
                                if(err){
                                    sails.log.debug("updateGroupUser: Error: Can't save groupUser. :"+ err);
                                    return callback("Error: Can't save groupUser. :"+ err,null);
                                }
                                sails.log.debug("updateGroupUser: Success: groupUser has been modified !");
                                Group.publishUpdate(group.id,{giveAccess:true,codeGroup:group.code,email:email,admin:giveAdmin})
                                return callback(null,{message:"Success: groupUser has been modified !",groupUser:groupUser});
                            })
                        })
                    })
                }
                else{
                    sails.log.debug("updateGroupUser: Error: User has no right to do this action.")
                    return callback("Error: User has no right to do this action.",null)
                }
            })
        })
    },
    createGroupUser:function(groupUserModel,callback){
        // V�rifier que l'entr�e n'existe pas d�j� dans la table.
        this.checkIfGroupUserExist(groupUserModel,function(err,exist){
            if(err)
                return callback(err,null);
            if(exist){
                sails.log.debug("createGroupUser: Error: Link already existing !");
                return callback("Error: Link already existing !",null)
            }
            GroupUser.create({user:groupUserModel.user,group:groupUserModel.group,admin:groupUserModel.admin,validate:groupUserModel.validate}).exec(function(err,groupUser){
                if(err) {
                    sails.log.debug("createGroupUser: Error: Can't create GroupUser ! ");
                    return callback("Error: Can't create GroupUser :" + err, null);
                }
                sails.log.debug('createGroupUser: Success: GroupUser was successfully created !!');
                return callback(null,groupUser);
            });
        })
    },
    destroyGroupUserbyGroup: function(group_id,callback){
        GroupUser.destroy({group_id:group_id}).exec(function(err){
            if(err) {
                sails.log.debug("destroyGroupUserbyGroup: Error: The GroupUser couldn't be deleted");
                return callback("Error: The GroupUser couldn't be deleted" + err);
            }
            sails.log.debug("destroyGroupUserbyGroup: Success: The GroupUser was deleted.")
            return callback(null);
        })
    },
    destroyGroupUserbyUserAndGroup: function(groupUserModel,callback){
        this.checkIsAdmin(groupUserModel,function(err,admin){
            if(err)
                return callback(err,null);
            if(admin)
                return callback("Error: Admin can't exit his group ! Please edit the right.",null);
            GroupUser.destroy({where:{group_id:groupUserModel.group,user_id:groupUserModel.user}}).exec(function(err){
                if(err) {
                    sails.log.debug("destroyGroupUserbyUserAndGroup: Error: The GroupUser couldn't be deleted");
                    return callback("Error: The GroupUser couldn't be deleted" + err,null);
                }
                sails.log.debug("destroyGroupUserbyGroup: Success: The GroupUser was deleted.")
                return callback(null,"Success: The GroupUser was deleted.");
            })
        })
    }
};
