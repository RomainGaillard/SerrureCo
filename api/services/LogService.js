// File location: /api/services/LogService.js

var logModel = require('../models/Log.js');
var lockModel = require('../models/lock.js');

var LogService = {
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure fourni en paramètre
     */
    FindByLock: function FindByLockService(lock) {
        return logModel.find({ where: { lock: lock.id }, limit: 200 })
    },
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure et la date fournis en paramètre
     */
    FindByLockAndDate: function FindByLockAndDateService(lock, date) {
        return logModel.find({ where: { lock: lock.id, date: date.createdAt } })
    },
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure et l'interval
     * de date fournis en paramètre
     */
    FindByLockAndDualDate: function FindByLockAndDualDateService(lock, start, end) {
        return logModel.find({ where: { lock: lock.id, date: { '>': start.createdAt, '<': end.createdAt }}})
    },
    /**
     * @description :: Récupère dans la bdd les logs correspondant à la serrure fourni en paramètre
     */
    create: function createService(log) {
        return Log.create({log:log});
    }
};


module.exports = LogService;