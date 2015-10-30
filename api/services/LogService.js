// File location: /api/services/LogService.js

var LogService = {
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure fourni en paramètre
     */
    findByLock: function findByLockService(lock, callback ) {
        Log.find({ where: { lock: lock.id }, limit: 200 }).exec(function (err, found){
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
    findByLockAndDate: function findByLockAndDateService(lock, date) {
        return Log.find({ where: { lock: lock.id, date: date.createdAt } })
    },
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure et l'interval
     * de date fournis en paramètre
     */
    findByLockAndDualDate: function findByLockAndDualDateService(lock, start, end) {
        return Log.find({ where: { lock: lock.id, date: { '>': start.createdAt, '<': end.createdAt }}})
    },
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure fourni en paramètre
     */
    create: function createService(log, callback) {
        Log.create({message: log.message, lock: log.lock.id, user: log.user.id}).exec(function createLog(err, created){
            if (created) {
                console.log('Log was successfully created !');
                callback(false);
            } else {
                console.log('Fail create group !');
                callback(true);
            }
        });
    }
};


module.exports = LogService;