var models = require('../app/models'),
    md5 = require('MD5');

module.exports = {
    index: function(req, res) {
        models.Device.find({}, function(err, data) {
            res.json(data);
        });
    },
    getById: function(req, res) {
        models.Device.find({ _id: req.params.id }, function(err, device) {
            if (err) {
                res.json({error: 'Device not found.'});
            } else {
                res.json(device);
            }
        });
    },
    add: function(req, res) {
        var newDevice = new models.Device(req.body);
        newDevice.gravatar = md5(newDevice.email);
        newDevice.save(function(err, device) {
            if (err) {
                res.json({error: 'Error adding device.'});
            } else {
                res.json(device);
            }
        });
    },
    update: function(req, res) {                
        models.Device.findById(req.params.id, function(err, device) {            
            var key;
            for (key in req.body) {
              device[key] = req.body[key];
            }

            if (err) {
                res.json({error: 'Device not found.'});
            } else {
                device.save(function (err) {
                    if(err){
                        res.json({error: 'Error updating device.'}); 
                    }
                    else{
                        res.json(device);
                    }                    
                });
            }
        })
    },
    delete: function(req, res) {
        models.Device.findOne({ _id: req.params.id }, function(err, device) {
            if (err) {
                res.json({error: 'Device not found.'});
            } else {
                device.remove(function(err, device){
                    res.json(200, {status: 'Success'});
                })
            }
        });
    }
};
