var Marionette = require('backbone.marionette');

module.exports = Router = Marionette.AppRouter.extend({
    appRoutes: {
		'' : 'login',
        'home'  : 'home',
        'details/:id' : 'details',
        'add' : 'add',
        'login' : 'login',
        'signup' : 'signup'
    }
});
