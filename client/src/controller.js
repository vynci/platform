var Marionette = require('backbone.marionette'),
    DevicesView = require('./views/devices'),
    DeviceDetailsView = require('./views/device_details'),
    AddDeviceView = require('./views/add');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        window.App.views.devicesView = new DevicesView({ collection: window.App.data.devices });
    },

    home: function() {
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');
        var view = window.App.views.devicesView;
        this.renderView(view);
        window.App.router.navigate('#');
    },

    details: function(id) {
        App.core.vent.trigger('app:log', 'Controller: "Device Details" route hit.');
        var view = new DeviceDetailsView({ model: window.App.data.devices.get(id)});
        this.renderView(view);
        window.App.router.navigate('details/' + id);
    },

    add: function() {
        App.core.vent.trigger('app:log', 'Controller: "Add Device" route hit.');
        var view = new AddDeviceView();
        this.renderView(view);
        window.App.router.navigate('add');
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
