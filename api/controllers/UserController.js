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
        console.log(req.passport.user)
        User.findOne({id: req.passport.user.id}).exec(function (err, user) {
            if(err) {
                console.log(err)
            }

            user.email = email;
            user.firstname = name;
            user.lastname = lastname;

            user.save(function(err) {
                if(err) {
                    console.log("save----" + err)
                    return res.send(err.status, err);
                }
                return res.send(200, user);
            })
        })
        //User.update({firstname: req.passport.user.firstname},{firstname: name}, {lastname: req.passport.user.lastname}, {lastname: lastname}, {email: req.passport.user.email}, {email: email}).exec(function(err, callback) {
        //    if(err){
        //        console.log(err);
        //        res.badRequest();
        //    }
        //    res.ok()
        //
        //})

        //User.update({username: req.passport.user.username},{firstname: req.passport.user.firstname}, {firstname: name}, {lastname: req.passport.user.lastname}, {lastname: lastname}, {email: req.passport.user.email}, {email: email}).exec(function(err, callback) {
        //    if(err){
        //        console.log(err);
        //        res.badRequest();
        //    }
        //    res.ok()
        //
        //})

        //req.passport.user.update({firstname: name}, {lastname: lastname}, {email: email}).exec(function(err, callback) {
        //    console.log(err)
        //})
    }
};