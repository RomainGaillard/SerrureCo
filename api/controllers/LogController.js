/**
 * LogController
 *
 * @description :: Server-side logic for managing logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * @description :: Retourne un json avec les logs correspondant à la serrure passé en paramètre
     */
    logs: function (req, res) {
        //Appel LogService::FindByLock(req.param('lock'))
    },
    /**
     * @description :: Retourne un json avec les logs correspondant à la serrure fourni
     * en paramètre selon un jour choisi
     */
    logsByLockAndDate: function (req, res) {
        /**
         *Appel LogService::FindByLockAndDate(
        req.param('lock'),
         req.param('date')
         ); */
    },
    /**
     * @description :: Retourne un json avec les logs correspondant à la serrure fourni en paramètre
     * selon l'interval de date
     */
    logsByLockAndDualDate: function (req, res) {
        //Appel LogService::FindByLockAndDualDate(
        // req.param('lock'),
        // req.param('start'),
        // req.param('end')
        // );
    }
};

