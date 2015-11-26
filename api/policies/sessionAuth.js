/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  var token = req.headers.authorization || false;
  if (req.isSocket && req.param('token')) {
    Passport.findOne({accessToken:req.param('token')})
        .populate('user').exec(function (err, passport){
          if (err || !passport){
            return res.status(401).json({err: "user should be authenticated"});
          }
          req.passport = passport;
          req.accessToken = token;
          next();
        })
  }else if (token){
    Passport.findOne({accessToken:token})
        .populate('user').exec(function (err, passport){
          if (err || !passport){
            return res.status(401).json({err: "user should be authenticated"});
          }
          req.passport = passport;
          req.accessToken = token;
          next();
        })
  }
  else {
    sails.log.debug("token manquant");
    return res.status(401).json({err: "user should be authenticated"} )
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};
