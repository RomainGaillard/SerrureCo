/**
 * LogController
 *
 * @description :: Server-side logic for managing logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var logService = require('../services/LogService.js');
var log = require('../models/Log.js');
var lockModel = require('../models/Lock.js');
var user = require('../models/User.js');

module.exports = {
    /**
     * @description :: Retourne un json avec les logs correspondant à la serrure passé en paramètre
     */
    logs: function (req, res) {
        if (logs = logService.FindByLock(req.param('lock')) ) {
            return res.json(logs, 200)
        } else {
            return res.notFound()
        }
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
        //log = [
        //    req.param('message'),
        //    req.param('lock'),
        //    req.param('user')
        //];
        log.message = req.param('message');
        lockModel.id = req.param('lock');
        log.lock = lockModel;
        user.id = req.param('user');
        log.user = user;


        if (result = logService.create(log)) {
            sails.log(result)
            return res.ok();
        } else {
            return res.badRequest()
        }
    }
};

