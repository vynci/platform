var Marionette = require('backbone.marionette');
var io = require('../../requires/socket.io-client/js/socket.io');
var socket = io(window.location.host);
var _ = require('underscore');

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
        'click input.pwm-device' : 'updatePWM',
        'click span.link-status' : 'showDetails'
    },

    onRender: function() {
      //console.log(this.model.get('info')[0].serial);
      this.$el.find('span.default-device').hide();
      this.$el.find('span.sensor-device').hide();
      this.$el.find('input.pwm-device').hide();

      if( this.model.get('link') ){
        this.$el.find('span.link-status').html(this.model.get('link'));
      }
    },

    updatePWM: function() {
      console.log(this.$el.find('input.pwm-device').val());
      socket.emit('user-update', {
        'owner':App.data.user,
        'state':1
      });
    },

    updateState: function() {
      socket.emit('user-update', {
        'owner':App.data.user,
        'state':1,
        'serial': this.model.get('serial'),
        'switchNum': this.model.get('switchNum')
      });
    },

    updateStatus: function(data) {
      console.log('update-status!');
      console.log( data );
      var deviceStatus = _.findWhere(data.nodes, {switchNum : this.model.get('switchNum')});
      if(deviceStatus){
        data.state = deviceStatus.state;
        data.switchNum = deviceStatus.switchNum;
        console.log(data);
      }

      if(data.status === 'online' && data.serial === this.model.get('serial')){
        this.$el.find('span.hub-status').addClass('active-switch');
        this.$el.find('span.hub-status').html('online');
        this.$el.find('span.default-device').show();

        if(data.state === 'on' && data.switchNum === this.model.get('switchNum')){
          this.$el.find('span.default-device').show();
          this.$el.find('span.default-device').addClass('active-switch');
        }
        if(data.state === 'off' && data.switchNum === this.model.get('switchNum')){
          this.$el.find('span.default-device').show();
          this.$el.find('span.default-device').removeClass('active-switch');
        }
        if(data.type === 'sensor' && data.switchNum === this.model.get('switchNum')){
          this.$el.find('span.sensor-device').show();
          this.$el.find('span.sensor-device').html(data.state);
          this.$el.find('span.default-device').hide();
        }
        if(data.type === 'pwm' && data.switchNum === this.model.get('switchNum')){
          this.$el.find('input.pwm-device').show();
          this.$el.find('input.pwm-device').attr('value', data.state);
          this.$el.find('span.default-device').hide();
        }

      }
      else{
        this.$el.find('span.hub-status').removeClass('active-switch');
        this.$el.find('span.hub-status').html('offline');
        this.$el.find('span.default-device').hide();
        this.$el.find('span.default-device').hide();
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
      if(!socket.connected){
        socket.connect();
      }
      socket.emit('user-info', {'owner':App.data.user});
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
