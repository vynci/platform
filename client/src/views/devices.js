var Marionette = require('backbone.marionette');
var io = require('../../requires/socket.io-client/js/socket.io');
var socket = io(window.location.host);

var itemView = Marionette.ItemView.extend({
    template: require('../../templates/device_small.hbs'),
    initialize: function() {
        socket.on('device-status', function ( data ) {
            console.log(data);
        });
    },
    events: {
        'click .details': 'showDetails',
        'click div.onoffswitch' : 'updateState'
    },

    onRender: function() {
        if(this.model.get('state') === 0){
            this.$el.find('div.onoffswitch').addClass('active-switch');
            this.$el.find('div.onoffswitch').html('on');
        } else {
            this.$el.find('div.onoffswitch').removeAttr('active-switch');
            this.$el.find('div.onoffswitch').html('off');
        }
    },

    updateState: function() {
        var that = this;
        if(this.model.get('state') === 0){
            this.model.save({state:1}, {
                success : function () {
                    that.$el.find('div.onoffswitch').addClass('active-switch');
                    that.$el.find('div.onoffswitch').html('off');
                }
            } );
        } else {
            this.model.save({state:0}, {
                success : function () {
                    that.$el.find('div.onoffswitch').removeAttr('active-switch');
                    that.$el.find('div.onoffswitch').html('on');
                }
            } );
        }
    },

    showDetails: function() {
        window.App.core.vent.trigger('app:log', 'Device View: showDetails hit.');
        window.App.controller.details(this.model.id);
    }
});

module.exports = CollectionView = Marionette.CompositeView.extend({
    template: require('../../templates/devices_container.hbs'),
    initialize: function() {
      socket.emit('user-info', 'user data');
    },
    itemView: itemView,

    onRender : function(){
        this.$el.find('a.email').html(window.App.data.user);
    }

});
