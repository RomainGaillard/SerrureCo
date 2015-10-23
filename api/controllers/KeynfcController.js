/**
 * KeynfcController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	countkeyNFC: function(req,res){
		KeyNFC.count({name:'posey'}),exec(function (err,count){
			if(err){
				return;
			}
			return res.send(count);
		})
	},
	keyNFCFindbyName : function(req,res){
		KeyNFC.findBy.param('name').exec(function (err,KeyNFCs){
		})
	},
	createkeyNFC : function (req,res){
		//KeyNFCservice.CreatekNFC({...});
		var owner = req.query.KeyNFC ; // url param
		var name = req.param('name'); // post param
		var userID = req.param('user_id');
		var number = req.param('num');
		KeyNFC.create({name:name, userID:user_id, number:num}).exec(function (err,KeyNFC){
		})
	},
	updatekeyNFC: function (req, res) {
	    var owner = req.query.KeyNFC ; // url param
		var name = req.param('name'); // post param
		var userID = req.param('user_id');
		var number = req.param('num');
		KeyNFC.update({name:name, userID:user_id, number:num}).exec(function (err,KeyNFC){
		})
	},
	removekeyNFC: function (req, res) {
	    var re = req.query.KeyNFC ; // url param
		var name = KeyNFC.findBy.param('name').exec(function (err,KeyNFCs){
		})
		var id = name.param('id');
		KeyNFCs.update({ id: req.param('id') }, { deleted: true }).exec(function (err, KeyNFC) {
            if (err) return res.json(err, 400);
            return res.json(KeyNFCs[0]);
     });
	}
};

