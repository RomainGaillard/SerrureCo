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

/****************************** Fonctionnel ****************************/
	create: function (req, res, next) {
    var params = req.params.all();
    KeyNFC.create(params, function(err, keynfc) {
        if (err) return next(err);
        res.status(201);
        res.json(keynfc);
    });
}
};

