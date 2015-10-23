/**
 * Created by Romain Gaillard on 23/10/2015.
 */

module.exports = {
    createGroup: function(req,res){
        var name = req.param('name');
        GroupService.create(name);
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
        GroupeService.giveRight(email)
    }
};