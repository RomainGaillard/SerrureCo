/**
 * Created by Bastien on 30/10/2015.
 */


var userModel = require('../models/User');
var passportModel = require('../models/Passport');
var bcrypt = require('bcryptjs');

module.exports = {

    get:function(req,res){
        if(req.isSocket){
            User.subscribe(req,req.passport.user.id);
            return res.status(200).json();
        }
    },
    update: function(req,res) {
        var name = req.param('firstname');
        var lastname = req.param('lastname');
        var email = req.param('email');
        if(!email || !name || !lastname) return res.badRequest('fields can\'t be empty');
        User.findOne({id: req.passport.user.id}).exec(function (err, user) {
            if(err)return res.send(err.status, err);
            //if(email !== user.email)
            //{
            //    console.log('lala')
            //    User.findOne({email: email}).exec(function(err, user) {
            //        if(err)return res.send(err.status, err);
            //        if(user)return res.status(409).json({err: 'toto'})
            //        })
            //}
            user.email = email;
            user.firstname = name;
            user.lastname = lastname;
            user.save(function(err) {
                if(err) {
                    console.log("save----" + err)
                    return res.send(err.status, err);
                }
                User.publishUpdate(user.id,{update:true,user:user});
                return res.send(200, user);
            })
        });

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
    },

    updatePassword: function (req,res) {
        var oldPassword = req.param("oldPassword");
        var newPassword = req.param("newPassword");

        if(!oldPassword || !newPassword) return res.badRequest();
        Passport.findOne({user: req.passport.user.id}).exec(function (err, passport) {
            if(err) return res.send(err.status, err);
            if(passport){
                bcrypt.compare(oldPassword,passport.password, function (err, isGood) {
                    if(err) return res.badRequest();
                    if(!isGood){
                        return res.forbidden();
                    }
                    passport.password = newPassword;

                    passport.save(function(err) {
                        if(err) return res.send(err.status, err);
                        return res.send(200);
                    })
/*                    bcrypt.hash(newPassword,10, function (err, hash) {
                        console.log("lalalal");
                        if(err) return res.badRequest();
                        console.log(newPassword);
                        console.log(hash);
                        console.log("lalalala");
                        passport.password = hash;

                        passport.save(function(err) {
                            if(err) return res.send(err.status, err);
                            console.log("lalalalala");
                            return res.send(200);
                        })
                    })
*/
                })
            }else{
                return res.badRequest()
            }


        })
    },

    findByEmail: function (req, res, next) {
        var email = req.param('email');
        User.find({ where: { email: email } }).exec(function (err, found){
            if (found) {
                next(null,found);
            } else {
                next(err, null);
            }
        });
        /*var idShortCut = isShortcut(email);
        if (idShortCut === true) {
            return next();
        }
        if (email) {
            User.findOne(email, function(err, callback) {
            if(callback === undefined) return res.notFound();
            if (err) return next(err);
                res.json(callback);
            });
        } else {
            var where = req.param('where');
            if (_.isString(where)) {
                where = JSON.parse(where);
            }
            var options = {
                limit: req.param('limit') || undefined,
                skip: req.param('skip')  || undefined,
                sort: req.param('sort') || undefined,
                where: where || undefined
                };
            console.log("This is the options", options);      
            User.find(options, function(err, callback) {
                if(callback === undefined) return res.notFound();
                if (err) return next(err);
                res.json(callback);
            });
        }

        function isShortcut(email) {
            if (email === 'find'   ||  email === 'update' ||  email === 'create' ||  email === 'destroy') {
            return true;
            }
        }*/
    }
};