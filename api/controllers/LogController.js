/**
 * LogController
 *
 * @description :: Server-side logic for managing logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var logService = require('../services/LogService.js');
var log = require('../models/Log.js');
var lock = require('../models/Lock.js');
var user = require('../models/User.js');

module.exports = {
    /**
     * @description :: Retourne un json avec les logs correspondant à la serrure passé en paramètre
     */
    logsByLock: function (req, res) {
        console.log('here');
        lock.id = req.param('id')
        LogService.findByLock(lock, function(err, logs){
            if(err){
                res.notFound()
            }
            else{
                res.ok(logs);
            }
        });
    },
    /**
     * @description :: Retourne un json avec les logs correspondant à la serrure fourni
     * en paramètre selon un jour choisi
     */
    logsByLockAndDate: function (req, res) {
        logs = logService.FindByLockAndDate(
            req.param('lock'),
            req.param('date')
        );

        if (logs) {
            return res.json(logs, 200)
        } else {
            return res.notFound()
        }
    },
    /**
     * @description :: Retourne un json avec les logs correspondant à la serrure fourni en paramètre
     * selon l'interval de date
     */
    logsByLockAndDualDate: function (req, res) {
        logs = logService.FindByLockAndDualDate(
            req.param('lock'),
            req.param('start'),
            req.param('end')
        );

        if (logs) {
            return res.json(logs, 200)
        } else {
            return res.notFound()
        }
    },
    addLog: function(req, res) {
        log.message = req.param('message');
        lock.id = req.param('lock');
        log.lock = lock;
        user.id = req.param('user');
        log.user = user;
        LogService.create(log, function(err){
            if(err){
                return res.badRequest;
            }
            else{
                return res.ok();
            }
        });
    }
};

