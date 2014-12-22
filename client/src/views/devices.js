var Marionette = require('backbone.marionette');
var io = require('../../requires/socket.io-client/js/socket.io');
var socket = io(window.location.host);

var itemView = Marionette.ItemView.extend({
    template: require('../../templates/device_small.hbs'),
    initialize: function() {
      var that = this;
      console.log('init!');
      this.listenTo(this.model, 'destroy', this.remove);
      socket.on('device-status', function ( data ) {
          that.updateStatus( data );
      });
    },
    events: {
        'click span.info': 'showDetails',
        'click span.default-device' : 'updateState'
    },

    onRender: function() {
      //console.log(this.model.get('info')[0].serial);
      this.$el.find('span.default-device').hide();
      this.$el.find('span.sensor-device').hide();
    },

    updateState: function() {
      socket.emit('user-update', {
        'owner':'testfoo@gmail.com',
        'state':1,
        'info': this.model.get( 'info' )
      });
    },

    updateStatus: function(data) {
      console.log('device-status!');
      if(data.status === 'online' && data.serial === this.model.get('info')[0].serial){
        this.$el.find('div.onoffswitch').addClass('active-switch');
        this.$el.find('div.onoffswitch').html('online');
        this.$el.find('span.default-device').show();

        if(data.state === 0 && data.switchNum === this.model.get('info')[0].switchNum){
          this.$el.find('span.default-device').addClass('active-switch');
        }
        if(data.state === 1 && data.switchNum === this.model.get('info')[0].switchNum){
          this.$el.find('span.default-device').removeClass('active-switch');
        }
        if(data.type === 'sensor' && data.switchNum === this.model.get('info')[0].switchNum){
          this.$el.find('span.sensor-device').show();
          this.$el.find('span.sensor-device').html(data.state + '&deg;C');
          this.$el.find('span.default-device').hide();
        }

      }
      else{
        this.$el.find('div.onoffswitch').removeClass('active-switch');
        this.$el.find('div.onoffswitch').html('offline');
        this.$el.find('span.default-device').hide();
      }
    },

    showDetails: function() {
      console.log(socket);
      socket.removeListener('device-status');
      window.App.core.vent.trigger('app:log', 'Device View: showDetails hit.');
      window.App.controller.details(this.model.id);
    },

    onClose : function () {
      console.log('remove listener');
      socket.removeListener('device-status', function(data){
        console.log('remove complete!');
      });
      window.App.controller.destroyCurrentView(this);
    }
});

module.exports = CollectionView = Marionette.CompositeView.extend({
    template: require('../../templates/devices_container.hbs'),
    initialize: function() {
      socket.emit('user-info', {'owner':'testfoo@gmail.com'});
    },
    itemView: itemView,

    onRender : function(){
      this.$el.find('a.email').html(window.App.data.user);
    },

    onClose : function () {
      window.App.controller.destroyCurrentView(this);
      socket.removeAllListeners('device-status');
      console.log('remove all lstners');
    }

});
