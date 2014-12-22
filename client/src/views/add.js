var Marionette = require('backbone.marionette');

module.exports = AddView = Marionette.ItemView.extend({
    template: require('../../templates/add.hbs'),
    events: {
        'click a.save-button': 'save'
    },

    save: function(e) {
        e.preventDefault();
        var newDevice = {
            name: this.$el.find('#name').val(),
            description: this.$el.find('#description').val(),
            owner: window.App.data.user,
            state: 1,
            serial: this.$el.find('#serial').val(),
            switchNum : parseInt( this.$el.find('#switch-number').val() )
        };

        window.App.data.devices.create(newDevice);
        window.App.core.vent.trigger('app:log', 'Add View: Saved new device!');
        window.App.controller.home();
    }
});
