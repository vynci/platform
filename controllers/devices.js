var models = require('../app/models'), 
    server = require('../server'),    
    md5 = require('MD5');
console.log(server);
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

    getByOwner: function(req, res) {
        models.Device.find({ owner: req.params.owner }, function(err, device) {
            if (err) {
                res.json({error: 'Device not found1.'});
            } else {
                res.json(device);
            }
        });
    },

    add: function(req, res) {
        var newDevice = new models.Device(req.body);
        newDevice.info = req.body.info;
        console.log(newDevice)      
        newDevice.save(function(err, device) {
            if (err) {
                res.json({error: err});
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
                        server.emitSocket(device);
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
