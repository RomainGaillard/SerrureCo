// File location: /api/services/LogService.js

var LogService = {
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure fourni en paramètre
     */
    findByLock: function findByLockService(lock, callback ) {
        Log.find({ where: { lock: lock }, limit: 200 }).exec(function (err, found){
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
        Log.find({ where: { lock: lock, createdAt: {'contains' : date} } }).exec(function (err, found){
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
        Log.query('SELECT * FROM Log where log.createdAt >= \"'+start+'\" AND log.createdAt <= \"'+end+'\"', function (err, found){
            if (found) {
                callback(null,found);
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