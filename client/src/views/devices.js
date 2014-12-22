var Marionette = require('backbone.marionette');
var io = require('../../requires/socket.io-client/js/socket.io');
var socket = io(window.location.host);

var itemView = Marionette.ItemView.extend({
    template: require('../../templates/device_small.hbs'),
    initialize: function() {
      var that = this;
      console.log('item view init!');
      this.listenTo(this.model, 'destroy', this.remove);
      socket.on('device-status', function ( data ) {
          that.updateStatus( data );
      });
    },
    events: {
        'click span.info': 'showDetails',
        'click span.default-device' : 'updateState',
        'click input.pwm-device' : 'updatePWM'
    },

    onRender: function() {
      //console.log(this.model.get('info')[0].serial);
      this.$el.find('span.default-device').hide();
      this.$el.find('span.sensor-device').hide();
      this.$el.find('span.empty-device').hide();
      this.$el.find('input.pwm-device').hide();
    },

    updatePWM: function() {
      console.log(this.$el.find('input.pwm-device').val());
      socket.emit('user-update', {
        'owner':'testfoo@gmail.com',
        'state':1
      });
    },

    updateState: function() {
      socket.emit('user-update', {
        'owner':'testfoo@gmail.com',
        'state':1
      });
    },

    updateStatus: function(data) {
      console.log('update-status!');

      if(data.status === 'online' && data.serial === this.model.get('serial')){
        this.$el.find('span.hub-status').addClass('active-switch');
        this.$el.find('span.hub-status').html('online');

        if(data.state === 0 && data.switchNum === this.model.get('switchNum')){
          this.$el.find('span.default-device').show();
          this.$el.find('span.default-device').addClass('active-switch');
        }
        if(data.state === 1 && data.switchNum === this.model.get('switchNum')){
          this.$el.find('span.default-device').show();
          this.$el.find('span.default-device').removeClass('active-switch');
        }
        if(data.type === 'sensor' && data.switchNum === this.model.get('switchNum')){
          this.$el.find('span.sensor-device').show();
          this.$el.find('span.sensor-device').html(data.state);
          this.$el.find('span.default-device').hide();
          this.$el.find('span.empty-device').hide();
        }
        if(data.type === 'pwm' && data.switchNum === this.model.get('switchNum')){
          this.$el.find('input.pwm-device').show();
          this.$el.find('input.pwm-device').attr('value', data.state);
          this.$el.find('span.default-device').hide();
          this.$el.find('span.empty-device').hide();
        }

      }
      else{
        this.$el.find('div.onoffswitch').removeClass('active-switch');
        this.$el.find('div.onoffswitch').html('offline');
        this.$el.find('span.default-device').hide();
        this.$el.find('span.default-device').hide();
        this.$el.find('span.empty-device').hide();
      }
    },

    showDetails: function() {
      window.App.core.vent.trigger('app:log', 'Device View: showDetails hit.');
      window.App.controller.details(this.model.id);
    },

    onClose : function () {
      window.App.controller.destroyCurrentView(this);
    }
});

module.exports = CollectionView = Marionette.CompositeView.extend({
    template: require('../../templates/devices_container.hbs'),
    initialize: function() {
      console.log('view init!');
      if(!socket.connected){
        socket.connect();
      }
      socket.emit('user-info', {'owner':'testfoo@gmail.com'});
    },
    itemView: itemView,

    onRender : function(){
      this.$el.find('a.email').html(window.App.data.user);
    },

    onClose : function () {
      window.App.controller.destroyCurrentView(this);
      socket.removeAllListeners('device-status');
      socket.disconnect();
      socket.destroy();
    }

});
