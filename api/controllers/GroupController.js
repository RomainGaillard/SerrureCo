/**
 * Created by Romain Gaillard on 23/10/2015.
 */
var GroupService = require('../services/GroupService.js');
var Group = require('../models/Group.js');

module.exports = {
    createGroup: function(req,res){
        var name = req.param('name');
        sails.log.debug("Creation GROUP: "+name);
        GroupService.createGroup(name, function(err){
            if(err){
                return res.badRequest;
            }
            else{
                return res.ok();
            }
        });
    },
    askaddgroup: function(req,res){
        var codeGroup = req.param('code')
        GroupeService.askAddGroup(codeGroup)
    },
    exitgroup: function(req,res){
        var codeGroup = req.param('code')
        GroupeService.exitGroup(codeGroup)
    },
    removegroup: function(req,res){
        var codeGroup = req.param('code')
        GroupeService.remove(codeGroup);
    },
    giveright: function(req,res){
        var codeGroup = req.param('code')
        var email = req.param('email')
        GroupeService.giveRight(codeGroup,email)
    }
};

