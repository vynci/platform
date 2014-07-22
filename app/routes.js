var home = require('../controllers/home'),
    devices = require('../controllers/devices');

module.exports.initialize = function(app) {
    app.get('/', home.index);
    app.get('/api/devices', devices.index);
    app.get('/api/devices/:id', devices.getById);
    app.post('/api/devices', devices.add);
    app.put('/api/devices/:id', devices.update);
    app.delete('/api/devices/:id', devices.delete);
};
