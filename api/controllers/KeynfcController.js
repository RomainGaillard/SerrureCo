/**
 * KeynfcController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var keyNFCModel = require('../models/KeyNFC.js');
var LockModel = require('../models/Lock.js');

module.exports = {
	locks: function (req, res) {
       /* if (locks = logService.FindByLock(req.param('lock')) ) {
            return res.json(logs, 200)
        } else { */
            //return res.notFound()
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
	removekeyNFC: function (req, res) {
		//KeyNFCservice.CreatekNFC({...});
	    var re = req.query.KeyNFC ; // url param
		var name = KeyNFC.findBy.param('name').exec(function (err,KeyNFCs){
		})
		var id = name.param('id');
		KeyNFCs.update({ id: req.param('id') }, { deleted: true }).exec(function (err, callb) {
            if (err) return res.json(err, 400);
            return res.json(KeyNFCs[0]);
     });
	},

	updatekeyNFC: function (req, res) {
	    owner = req.query.KeyNFC ; // url param
		name = req.param('name'); // post param
		userID = req.param('user_id');
		number = req.param('num');
		
		KeyNFC.update({name:object.name, userID:object.user_id, number:object.num}).exec(function (err,callb){
		})
	},

/****************************** Fonctionnel ****************************/
	find: function (req, res, next) {
		var id = req.param('id');
		var idShortCut = isShortcut(id);
		if (idShortCut === true) {
			return next();
		}
		if (id) {
			KeyNFC.findOne(id, function(err, sleep) {
			if(sleep === undefined) return res.notFound();
			if (err) return next(err);
				res.json(sleep);
			});
		} else {
			var where = req.param('where');
			if (_.isString(where)) {
				where = JSON.parse(where);
			}
			var options = {
				limit: req.param('limit') || undefined,
				skip: req.param('skip')  || undefined,
				sort: req.param('sort') || undefined,
				where: where || undefined
				};
			console.log("This is the options", options);      
			keyNFC.find(options, function(err, sleep) {
				if(sleep === undefined) return res.notFound();
				if (err) return next(err);
				res.json(sleep);
			});
		}

		function isShortcut(id) {
			if (id === 'find'   ||  id === 'update' ||  id === 'create' ||  id === 'destroy') {
			return true;
			}
		}
	},

	createkeyNFC : function (req,res){
		keyNFCModel.owner = req.query.KeyNFC ; // url param
		keyNFCModel.name = req.param('name'); // post param
		keyNFCModel.user_id = req.param('user_id');
		keyNFCModel.number = req.param('num');

		KeyNFCservice.createkNFC(keyNFCModel);
		/*KeyNFC.create({name:name, userID:user_id, number:num}).exec(function (err,callb){
		})*/
	}
};

