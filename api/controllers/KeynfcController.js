/**
 * KeynfcController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var keyNFCModel = require('../models/KeyNFC.js');
var LockModel = require('../models/Lock.js');

module.exports = {

	create: function (req, res, next) {
    var params = req.params.all();
    KeyNFC.create(params, function(err, keynfc) {
        if (err) return next(err);
        res.status(201);
        res.json(keynfc);
        });
    },

    findByName: function (req, res) {
        var name = req.param('name');
        KeyNFC.find({ where: { name: name }}).exec(function (err, found){
            if (err) return next(err);
            res.status(201).json(found);
        });
    },

    keyNFC:function(req,res){
        User.find({id:req.passport.user.id}).populate('keynfcs').exec(function(err,keynfcs){
            if(keynfcs){
                sails.log.debug("keynfc: Success: "+keynfcs);
                return res.ok(keynfcs);
            }
            sails.log.debug("keynfc: Error:"+err);
            return res.badRequest("keynfc: Error:"+err);
        })
    }
};