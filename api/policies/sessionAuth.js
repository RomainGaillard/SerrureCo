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
  if (token) {
    Passport.findOne({accessToken:token})
      .populate('user').exec(function (err, passport){
      if (err || !passport){
        console.log(passport.user);
        return res.status(401).json({err: "user should be authenticated"});
      }
      console.log(passport)
      req.passport = passport;
      req.accessToken = token;
      next();
    })
  }else {
    return res.status(401).json({err: "user should be authenticated"} )
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};
