var Marionette = require('backbone.marionette');
var DeviceModel = require('../models/user');

module.exports = DeviceDetailsView = Marionette.ItemView.extend({
    template: require('../../templates/login.hbs'),

    events: {
        'submit form': 'save'
    },
    save : function(){

    }
});
