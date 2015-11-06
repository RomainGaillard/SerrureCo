/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  /***************************************************************************
   * route User                                                           *
   ***************************************************************************/
    'put /user/update': 'UserController.update',

  /***************************************************************************
   * route Logs                                                           *
   ***************************************************************************/
    'get /locks/:id/logs': 'LogController.logsByLock',
    'get /locks/:id/logs/:date': 'LogController.logsByLockAndDate',
    'get /locks/:id/logs/:start&:end': 'LogController.logsByLockAndDualDate',
    'post /log/create': 'LogController.addLog',

  /***************************************************************************
   * route Group
   ***************************************************************************/
    'get /group':"GroupController.group",
    'get /group/:code/user':"GroupController.users",
    'get /group/:code/lock':"GroupController.lock",

    'post /group/create': "GroupController.create",
    'post /group/:code/lock/add/:id':"GroupController.addLock",
    'post /group/:code/lock/remove/:id':"GroupController.removeLock",
    'post /group/:code/join': "GroupController.join",
    'post /group/:code/askAccess':"GroupController.askAccess",

    'put /group/:code/edit':"GroupController.edit",
    'put /group/:code/giveAccess':"GroupController.giveAccess",

    'delete /group/:code/exit':"GroupController.exit",
    'delete /group/:code/exclude':"GroupController.exclude",
    'delete /group/:code/destroy': "GroupController.destroy",

  /***************************************************************************
   * route Lock                                                           *
   ***************************************************************************/
    'post /lock/create':"LockController.create",

  /***************************************************************************
  * route KeyNFC                                                             *
  * default route                                                            *
  * PUT update http://localhost:1337/keynfc/1?num=12&user_id=12              *
  ***************************************************************************/
  //'get /keyNFC/:id/locks': 'KeyNFC.locks',
  'get /keyNFC':'KeyNFC.keyNFC',
  
  'post /keyNFC/404/create/':'KeyNFC.create',
  'post /keyNFC/:name':'KeyNFC.findByName',
  /**************************************************************************/

  //route authentification passport

  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'get /register': 'AuthController.register',

  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',

  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback',

  /***************************************************************************
  * route User                                                               *
  ***************************************************************************/
  'post /user/:email':'UserController.findByEmail',

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
