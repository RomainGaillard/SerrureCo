// File location: /api/services/LogService.js
//
//var log = require('../models/Log.js');
//var user = require('../models/User.js');
var LogService = {
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure fourni en paramètre
     */
    findByLock: function findByLockService(lock, callback ) {
        Log.find({ where: { lock: lock }, limit: 200 }).populate("user").exec(function (err, found){
            if (found) {
                callback(null,found);
            } else {
                callback(err, null);
            }
        });
    },
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure et la date fournis en paramètre
     */
    findByLockAndDate: function findByLockAndDateService(lock, date, callback) {
        Log.find({ where: { lock: lock, createdAt: {'contains' : date} } }).populate("user").exec(function (err, found){
            if (found) {
                callback(null,found);
            } else {
                callback(err, null);
            }
        });
    },
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure et l'interval
     * de date fournis en paramètre
     */
    findByLockAndDualDate: function findByLockAndDualDateService(lock, start, end, callback) {
        var request = 'SELECT `l`.`message`, `l`.`id`, `l`.`createdAt`, `l`.`updatedAt`, `l`.`lock_id`, `l`.`user_id`, `u`.`username` ' +
            'FROM `log` `l` ' +
            'INNER JOIN `user` `u` ON `l`.`user_id`=`u`.`id` ' +
            'WHERE `l`.`createdAt` >= \"'+start+'\" AND `l`.`createdAt` <= \"'+end+'\"';
        Log.query(request, function (err, found){
            if (found) {
                var logs    = Array();
                for(var i =0; i < found.length; i++) {
                    var user = {
                        username:     found[i].username
                    };
                    var log = {
                        message:     found[i].message,
                        createdAt:   found[i].createdAt,
                        updatedAt:   found[i].updatedAt,
                        lock:        found[i].lock_id,
                        user:        user
                    };

                    logs[i]            = log;
                }
                callback(null,logs);
            } else {
                callback(err, null);
            }
        });
    },
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure fourni en paramètre
     */
    create: function createService(log, callback) {
        Log.create({message: log.message, lock: log.lock, user: log.user}).exec(function createLog(err, created){
            if (created) {
                console.log('Log was successfully created !');
                callback(true);
            } else {
                console.log('Fail create log !');
                callback(false);
            }
        });
    }
};
module.exports = LogService;