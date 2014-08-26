var Backbone = require('backbone'),
    DeviceModel = require('../models/device');

module.exports = DevicesCollection = Backbone.Collection.extend({
    model:  DeviceModel,
    url: '/api/devices'
 
});
