var Marionette = require('backbone.marionette'),
    Controller = require('./controller'),
    Router = require('./router'),
    DeviceModel = require('./models/device'),
    DevicesCollection = require('./collections/devices');

module.exports = App = function App() {};

App.prototype.start = function(){
    App.core = new Marionette.Application();

    App.core.on("initialize:before", function (options) {
        App.core.vent.trigger('app:log', 'App: Initializing');

        App.views = {};
        App.data = {};
        App.data.user = '';

        $.get( '/api/auth' )
          .done(function( data ) {            
            if(typeof data === 'object' && data.local.email){
                App.data.user = data.local.email;
                var devices = new DevicesCollection();
                devices.fetch({
                    success: function() {
                        App.data.devices = devices;
                        App.core.vent.trigger('app:start');
                    },
                    url: '/api/devicesByOwner/' + data.local.email                    
                });                 
            }
            else{
                App.core.vent.trigger('app:start');
            }
           
          });
        // load up some initial data:
        //
    });

    App.core.vent.bind('app:start', function(options){
        App.core.vent.trigger('app:log', 'App: Starting');
        if (Backbone.history) {
            App.controller = new Controller();
            App.router = new Router({ controller: App.controller });
            App.core.vent.trigger('app:log', 'App: Backbone.history starting');
            Backbone.history.start();
        }

        //new up and views and render for base app here...
        App.core.vent.trigger('app:log', 'App: Done starting and running!');
    });

    App.core.vent.bind('app:log', function(msg) {
        console.log(msg);
    });

    App.core.vent.bind('app:login', function(msg) {
        console.log('hello login');
    });

    App.core.start();
};
