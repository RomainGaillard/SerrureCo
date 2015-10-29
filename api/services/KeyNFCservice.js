// EmailService.js - in api/services
exports.CreatekNFC= function(name, user_id, num) {
KeyNFC.create({name:name, userID:user_id, number:num}).exec(function (err,KeyNFC){
	})
//keyNFC.send(opts);
};

exports.updatekNFC= function(name, user_id, num) {
	KeyNFC.update({name:name, userID:user_id, number:num}).exec(function (err,KeyNFC){
	})
};

exports.countkeyNFC= function(name){  /*
	KeyNFC.count({name:nam)}),exec(function (err,count){
		if(err){
			return;
		}
		return res.send(count);
	})   */
};
exports.keyNFCFindbyName= function(){
	KeyNFC.findBy.param('name').exec(function (err,KeyNFCs){
	})
};
exports.removekeyNFC= function (re, name, id) {
	KeyNFCs.update({ id: id}, { deleted: true }).exec(function (err, KeyNFC) {
        if (err) return res.json(err, 400);
        return res.json(KeyNFCs[0]);
 });
};