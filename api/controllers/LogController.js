/**
 * LogController
 *
 * @description :: Server-side logic for managing logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var log = require('../models/Log.js');
var lock = require('../models/Lock.js');
module.exports = {
    /**
     * @description :: Retourne un json avec les logs correspondant à la serrure passé en paramètre
     *
     * @API = {
     *      int lock
     *      authorization
     * }
     */
    logsByLock: function (req, res) {
        LogService.findByLock(req.param('id'), function(err, logs){
            if(err){
                res.badRequest()
            }
            else{
                res.ok({logs:logs});
            }
        });
    },
    /**
     * @description :: Retourne un json avec les logs correspondant à la serrure fourni
     * en paramètre selon un jour choisi
     *
     * @API = {
     *      int lock
     *      Date date
     *      authorization
     * }
     */
    logsByLockAndDate: function (req, res) {
        LogService.findByLockAndDate(
            req.param('id'),
            req.param('date'),
            function(err, logs){
                if(err){
                    res.badRequest()
                }
                else{
                    res.ok({log:logs});
                }
            }
        );
    },
    /**
     * @description :: Retourne un json avec les logs correspondant à la serrure fourni en paramètre
     * selon l'interval de date
     */
    logsByLockAndDualDate: function (req, res) {
        logs = LogService.findByLockAndDualDate(
            req.param('id'),
            req.param('start'),
            req.param('end'),
            function(err, logs){
                if(err){
                    res.badRequest()
                }
                else{
                    res.ok({logs:logs});
                }
            }
        );
    },
    /**
     * @API = {
     *      string message
     *      int lock
     *      authorization
     * }
     */
    addLog: function(req, res) {
        log.message = req.param('message');
        lock.id = req.param('lock');
        log.lock = lock;
        log.user = req.passport.id;
        LogService.create(log, function(isCreated){
            if(!isCreated){
                return res.badRequest();
            }
            else{
                res.status(201).json('Log was successfully created !');
            }
        });
    }
};

