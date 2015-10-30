/**
 * Created by Bastien on 30/10/2015.
 */


var userModel = require('../models/User');
var passportModel = require('../models/Passport');

module.exports = {

    update: function(req,res) {
        var name = req.param('firstname');
        var lastname = req.param('lastname');
        var email = req.param('email');
        console.log(req.passport.user.username)
        User = req.passport.user;
        User.update({firstname: name}, {lastname: lastname}, {email: email}).exec(function(err, callback) {
            console.log(err)
        })
        //req.passport.user.update({firstname: name}, {lastname: lastname}, {email: email}).exec(function(err, callback) {
        //    console.log(err)
        //})
    }
};