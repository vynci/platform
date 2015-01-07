var Marionette = require('backbone.marionette');

module.exports = AddView = Marionette.ItemView.extend({
    template: require('../../templates/add.hbs'),
    events: {
        'click button.save-button': 'save'
    },

    initialize : function() {
      console.log('add!');
      console.log(App.data.devices);
    },

    save: function(e) {
        e.preventDefault();
        var newDevice = {
            name: this.$el.find('#name').val(),
            description: this.$el.find('#description').val(),
            owner: window.App.data.user,
            state: 1,
            serial: this.$el.find('#serial').val(),
            switchNum : this.$el.find('#switch-number').val(),
            link : this.$el.find('#link').val()

        };

        window.App.data.devices.create(newDevice);
        window.App.core.vent.trigger('app:log', 'Add View: Saved new device!');
        window.App.controller.home();
    }
});
