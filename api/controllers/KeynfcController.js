/**
 * KeynfcController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var keyNFCModel = require('../models/KeyNFC.js');

module.exports = {
	locks: function (req, res) {
       /* if (locks = logService.FindByLock(req.param('lock')) ) {
            return res.json(logs, 200)
        } else { */
            return res.notFound()
        //}
    },
	countkeyNFC: function(req,res){
		KeyNFC.count({name:req.param('name')}),exec(function (err,count){
			if(err){
				return;
			}
			return res.send(count);
		})
	},
	updatekeyNFC: function (req, res) {
	    keyNFCModel.owner = req.query.KeyNFC ; // url param
		keyNFCModel.name = req.param('name'); // post param
		keyNFCModel.userID = req.param('user_id');
		keyNFCModel.number = req.param('num');
		
		KeyNFCservice.updatekNFC(keyNFCModel);
	},
	removekeyNFC: function (req, res) {
		//KeyNFCservice.CreatekNFC({...});
	    var re = req.query.KeyNFC ; // url param
		var name = KeyNFC.findBy.param('name').exec(function (err,KeyNFCs){
		})
		var id = name.param('id');
		KeyNFCs.update({ id: req.param('id') }, { deleted: true }).exec(function (err, KeyNFC) {
            if (err) return res.json(err, 400);
            return res.json(KeyNFCs[0]);
     });
	},

/******************************/
	createkeyNFC : function (req,res){
		keyNFCModel.owner = req.query.KeyNFC ; // url param
		keyNFCModel.name = req.param('name'); // post param
		keyNFCModel.user_id = req.param('user_id');
		keyNFCModel.number = req.param('num');

		KeyNFCservice.createkNFC(keyNFCModel);
	},
	keyNFCFindbyName : function(req,res){
		keyNFCModel.name = req.param('name');
		if (keyNFCModel = KeyNFCservice.FindByLock(keyNFCModel) ) {
            return res.json(logs, 200)
        } else {
            return res.notFound()
        }
	}
};

