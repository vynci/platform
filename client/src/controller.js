var Marionette = require('backbone.marionette'),
    DevicesView = require('./views/devices'),
    DeviceDetailsView = require('./views/device_details'),
    LoginView = require('./views/login'),
    SignUpView = require('./views/signup'),
    AddDeviceView = require('./views/add');

var MyApp = new Backbone.Router();

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        //window.App.views.devicesView = new DevicesView({ collection: window.App.data.devices });
        window.App.views.loginView = new LoginView();
    },

    login: function() {
        window.App.views.loginView = new LoginView();
        App.core.vent.trigger('app:log', 'Controller: "login" route hit.');
        var view = window.App.views.loginView;
        this.renderView(view);
        window.App.router.navigate('#login');
    },

    signup: function() {
        window.App.views.signupView = new SignUpView();
        App.core.vent.trigger('app:log', 'Controller: "signup" route hit.');
        var view = window.App.views.signupView;
        this.renderView(view);
        window.App.router.navigate('#signup');
    },

    home: function() {
        var dataDevices = window.App.data.devices;
        App.core.vent.trigger('app:login');

        if(dataDevices === undefined){
            MyApp.navigate('#login', {trigger: true});   
        }
        else{
            window.App.views.devicesView = new DevicesView({ collection: window.App.data.devices });
            var view = window.App.views.devicesView;
            this.renderView(view);
            window.App.router.navigate('#home');
        }
    },

    details: function(id) {
        App.core.vent.trigger('app:log', 'Controller: "Device Details" route hit.');
        var view = new DeviceDetailsView({ model: window.App.data.devices.get(id)});
        this.renderView(view);
        window.App.router.navigate('details/' + id);
    },

    add: function() {
        var dataDevices = window.App.data.devices;

        if(dataDevices === undefined){
            MyApp.navigate('#login', {trigger: true});
        }
        else{
            App.core.vent.trigger('app:log', 'Controller: "Add Device" route hit.');
            var view = new AddDeviceView();
            this.renderView(view);
            window.App.router.navigate('add');
        }

    },

    renderView: function(view) {
        this.destroyCurrentView(view);
        App.core.vent.trigger('app:log', 'Controller: Rendering new view.');
        $('#js-boilerplate-app').html(view.render().el);
    },

    destroyCurrentView: function(view) {
        if (!_.isUndefined(window.App.views.currentView)) {
            App.core.vent.trigger('app:log', 'Controller: Destroying existing view.');
            window.App.views.currentView.close();
        }
        window.App.views.currentView = view;
    }
});
