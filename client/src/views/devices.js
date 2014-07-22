var Marionette = require('backbone.marionette');

var itemView = Marionette.ItemView.extend({
    template: require('../../templates/device_small.hbs'),
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },
    events: {
        'click .details': 'showDetails',
        'click div.onoffswitch' : 'updateState' 
    },

    onRender: function() {
        if(this.model.get('state') === 'on'){
            this.$el.find('div.onoffswitch').addClass('active-switch');
            this.$el.find('div.onoffswitch').html('on');
        } else { 
            this.$el.find('div.onoffswitch').removeAttr('active-switch');
            this.$el.find('div.onoffswitch').html('off');
        }        
    },  

    updateState: function() {        
        if(this.model.get('state') === 'on'){
            this.$el.find('div.onoffswitch').addClass('active-switch');
            this.$el.find('div.onoffswitch').html('off');
            this.model.save({state:'off'});
        } else { 
            this.$el.find('div.onoffswitch').removeAttr('active-switch');
            this.$el.find('div.onoffswitch').html('on');
            this.model.save({state:'on'});
        }  
    },

    showDetails: function() {
        window.App.core.vent.trigger('app:log', 'Device View: showDetails hit.');
        window.App.controller.details(this.model.id);
    }
});

module.exports = CollectionView = Marionette.CollectionView.extend({
    initialize: function() {
        this.listenTo(this.collection, 'change', this.render);
    },
    itemView: itemView
});
