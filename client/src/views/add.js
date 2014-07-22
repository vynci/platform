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
            state: 'off'
        };

        window.App.data.devices.create(newDevice);
        window.App.core.vent.trigger('app:log', 'Add View: Saved new device!');
        window.App.controller.home();
    }
});
