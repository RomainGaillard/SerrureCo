/**
 * Created by Romain Gaillard on 23/10/2015.
 */

module.exports = {
    createGroup: function(req,res){
        sails.log.debug("Creation GROUP !");
        Group.create({name:"Shit",code:"444"}).exec(function(err,group){
        });
        //var name = req.param('name');
        //return GroupService.createGroup("toto");
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

