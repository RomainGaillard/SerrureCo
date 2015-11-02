/**
 * Created by Romain Gaillard on 23/10/2015.
 */

var groupUserModel = require('../models/GroupUser.js');

module.exports = {

    findByCode:function(code,callback){
        Group.findOne({ where: { code: code }}).exec(function (err, group){
            if (group) {
                callback(null,group);
            } else {
                sails.log.debug("findByCode group: Error: The code group not exit ! : " + err);
                callback("Error: The code group not exit ! :" + err, null);
            }
        });
    },
    checkIsAdmin:function(groupUser,callback){
        GroupUser.findOne({where:{group_id:groupUser.group,user_id:groupUser.user}}).exec(function(err,groupUser){
            if(groupUser)
                return callback(null,groupUser.admin)
            sails.log.debug("checkIsAdmin group: Error: Can't check if user is admin of the group. : "+err);
            return callback("Error: Can't check if user is admin of the group. : "+err,null);
        })
    },
    checkIfGroupUserExist:function(groupUser,callback){
        GroupUser.find({ where : {group: groupUserModel.group,user:groupUserModel.user}}).exec(function (err, group){
            if(group){
                if(group.length<=0)
                    return callback(null,false);
                return callback(null,true);
            }
            sails.log.debug("checkIfGroupUserExist: Error - Can't check if link exist in the Group_User table : "+err);
            return callback("Error - Can't check if link exist in the Group_User table : "+err,null);
        });
    },
    updateGroupUser:function(codeGroup,user_admin,email,callback){
        GroupService.findByCode(codeGroup,function(err,group){
            if(err)
                return callback(err,null);
            groupUserModel.group = group.id;
            groupUserModel.user = user_admin;
            GroupService.checkIsAdmin(groupUserModel,function(err,admin){
                if(err)
                    return callback(err,null);
                if(admin){
                    User.findOne({email:email}).exec(function(err,user){
                        if(err){
                            sails.log.debug("updateGroupUser: Error: The email was not found :"+err);
                            return callback("Error: The email was not found :"+err,null);
                        }
                        GroupUser.findOne({where:{user_id:user.id,group_id:group.id}}).exec(function (err,groupUser){
                            if(err){
                                sails.log.debug("updateGroupUser: Error: This user is not associated with this group. : "+err);
                                return callback("Error: This user is not associated with this group. : "+err,null);
                            }
                            groupUser.admin = true;
                            groupUser.valiate = true;
                            groupUser.save(function(err){
                                if(err){
                                    sails.log.debug("updateGroupUser: Error: Can't save groupUser. :"+ err);
                                    return callback("Error: Can't save groupUser. :"+ err,null);
                                }
                                sails.log.debug("updateGroupUser: Success: groupUser has been modified !");
                                console.log(groupUser);
                                return callback(null,"Success: groupUser has been modified !" +groupUser);
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
        GroupUser.create({user:groupUserModel.user,group:groupUserModel.group,admin:groupUserModel.admin,validate:groupUserModel.validate}).exec(function(err,groupUser){
            if(err) {
                sails.log.debug("createGroupUser: Error: Can't create GroupUser ! ");
                return callback("Error: Can't create GroupUser :" + err, null);
            }
            sails.log.debug('createGroupUser: Success: GroupUser was successfully created !!');
            console.log(groupUser);
            return callback(null,groupUser);
        });
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
        GroupUser.destroy({where:{group_id:groupUserModel.group_id,user_id:groupUserModel.user_id}}).exec(function(err){
            if(err) {
                sails.log.debug("destroyGroupUserbyUserAndGroup: Error: The GroupUser couldn't be deleted after Group.destroy");
                return callback("Error: The GroupUser couldn't be deleted after Group.destroy : " + err,null);
            }
            sails.log.debug("destroyGroupUserbyGroup: Success: The GroupUser was deleted.")
            return callback(null,"Success: The GroupUser was deleted.");
        })
    }
};
