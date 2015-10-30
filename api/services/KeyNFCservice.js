// KeyNFCservice.js - in api/services
exports.createkNFC = function(object) {
KeyNFC.create({name:object.name, userID:object.user_id, number:object.num}).exec(function (err,KeyNFC){
	})
//keyNFC.send(opts);
};

exports.keyNFCFindbyName = function(params){
	KeyNFC.find(params.name).exec(function (err,KeyNFCs){
	})
};

exports.updatekNFC = function(object) {
	KeyNFC.update({name:object.name, userID:object.user_id, number:object.num}).exec(function (err,KeyNFC){
	})
};

exports.removekeyNFC = function (params) {
	KeyNFCs.update({ id: params.id}, { deleted: true }).exec(function (err, KeyNFC) {
        if (err) return res.json(err, 400);
        return res.json(KeyNFCs[0]);
 });
};

exports.findByLock = function(lock) {
        return logModel.find({ where: { lock: lock.id }, limit: 200 })
};

exports.countkeyNFC = function(params){  /*
	KeyNFC.count({name:params.name)}),exec(function (err,count){
		if(err){
			return;
		}
		return res.send(count);
	})   */
};