/**
 * Created by Romain Gaillard on 05/11/2015.
 */

/**
 * LuckController
 *
 * @description :: Server-side logic for managing lucks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function(req,res){
        var name = req.param("name");
        var addressMac = req.param("addressMac");
        var  state = req.param("state");
        var hasCamera = req.param("hasCamera");
        var hasBell = req.param("hasBell");
        var hasMicro = req.param("hasMicro");
        var planning = req.param("planning");
        var isRegister = req.param("isRegister");
        var groups = req.param("groups");
    }
};

