var mongoose = require('mongoose'),
    models = require('./models'),
    md5 = require('MD5');

module.exports = {
    check: function() {
        models.Device.find({}, function(err, devices) {
            if (devices.length === 0) {
                console.log('no device found, seeding...');
                var newDevice = new models.Device({
                    name: 'Living Room',
                    description: 'Ventilation Control',
                    state: 'off'
                });
                newDevice.save(function(err, device) {
                    console.log('successfully inserted device: ' + device._id);
                });
            } else {
                console.log('found ' + devices.length + ' existing devices!');
            }
        });
    }
};
