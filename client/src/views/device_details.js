var Marionette = require('backbone.marionette');

module.exports = DeviceDetailsView = Marionette.ItemView.extend({
    template: require('../../templates/device_details.hbs'),
    events: {
        'click a.back': 'goBack',
        'click a.delete': 'deleteDevice',
        'click a.save-button': 'save'
    },
    initialize : function(){
      console.log(this.model);
    },

    save : function(e){
      e.preventDefault();

      var updateDevice = {
        name: this.$el.find('#name').val(),
        description: this.$el.find('#description').val(),
        owner: window.App.data.user,
        state: 1,
        serial: this.$el.find('#serial').val(),
        switchNum : this.$el.find('#switch-number').val(),
        link : this.$el.find('#link').val()

      };

      this.model.save(updateDevice, {
        success : function ( data ) {
          console.log(data);
          window.App.core.vent.trigger('app:log', 'Add View: Saved new device!');
          window.App.controller.home();          
        }
      } );
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
