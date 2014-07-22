var Backbone = require('backbone');

module.exports = DeviceModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: 'api/devices'
});
