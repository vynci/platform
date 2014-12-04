var Marionette = require('backbone.marionette');

module.exports = DeviceDetailsView = Marionette.ItemView.extend({
    template: require('../../templates/device_details.hbs'),
    events: {
        'click a.back': 'goBack',
        'click a.delete': 'deleteDevice'
    },

    goBack: function(e) {
        e.preventDefault();        
        window.App.controller.home();
    },
    deleteDevice: function(e) {
        e.preventDefault();
        console.log('Deleting device');
        window.App.data.devices.remove(this.model);

        // this will actually send a DELETE to the server:
        this.model.destroy();

        window.App.controller.home();
    }
});
