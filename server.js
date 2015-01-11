var express      = require('express');
var http         = require('http');
var path         = require('path');
var routes       = require('./app/routes');
var exphbs       = require('express3-handlebars');
var mongoose     = require('mongoose');
var app          = express();
var socket       = require('socket.io');
var passport     = require('passport');
var flash        = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var _            = require('underscore');

app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: app.get('views') + '/layouts'
}));
app.set('view engine', 'handlebars');

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('some-secret-value-here'));
app.use(app.router);
app.use('/', express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//connect to the db server:
//mongoose.connect('mongodb://laser:laser10@kahana.mongohq.com:10050/vynci-test');
mongoose.connect('mongodb://localhost/test-avayah2');
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");
});

//routes list:
routes.initialize(app, passport);

require('./config/passport')(passport); // pass passport for configuration

//finally boot up the server:
var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});

var io = socket.listen(server);
var deviceClients = [];
var userClients = [];

module.exports.emitSocket = function(status){
    _.each(deviceClients, function( client ) {
        if ( client.deviceId == status.serial) {
            client.emit('config-save', status);
        }
    } );
    console.log(status);
}

io.sockets.on('connection', function (socket) {

    socket.on('device-info', function (data) {
        console.log(data);
        socket.deviceId = data.serial;
        socket.owner = data.owner;
        socket.status = data.status;
        socket.nodes = data.nodes;

        deviceClients.push(socket);
        console.log('Device client: ' + socket.deviceId + ' connected');
        console.log('number of devices: ' + deviceClients.length);
        matchUserClient(socket);
    });

    socket.on('user-info', function (data) {
        socket.userId = data.owner;
        userClients.push(socket);
        console.log('User client: ' + socket.userId + ' connected');
        console.log('number of users: ' + userClients.length);
        matchDeviceClient(socket);
    });

    socket.on('device-update', function (data) {
        matchUserClient( data );
    });

    socket.on('user-update', function (data) {
        console.log('user update!!!');
        console.log(data);
        matchAndChangeState(data);
    });

    socket.on('device-state-update', function (data) {
        console.log(data);
        matchAndUpdateStateOnUser( data );
    });

    socket.on('disconnect', function() {
        var index  = deviceClients.indexOf(socket);
        var index2 = userClients.indexOf(socket);

        if (index != -1) {
            socket.status = 'offline';
            matchUserClient(socket);
            deviceClients.splice(index, 1);
            console.info('Device Client gone (id=' + socket.id + ').');
        }

        if (index2 != -1) {
            userClients.splice(index2, 1);
            console.info('User Client gone (id=' + socket.id + ').');
        }


    });

});

// Emit status from Device to User Client
function matchUserClient(data) {
    console.log('Matching User Client');
    _.each(userClients, function( client ) {
        if ( client.userId == data.owner) {
            var deviceInfo = {
              'serial' : data.deviceId || data.serial,
              'owner'  : data.owner,
              'status' : data.status,
              'switchNum': data.switchNum,
              'type': data.type,
              'state': data.state
            }
            console.log('User Client Matched');
            client.emit('device-status', deviceInfo);
        }
    } );
}

// Emit status of User to Device
function matchDeviceClient(user) {
    console.log('Matching Device Client');
    _.each(deviceClients, function( device ) {
        if ( device.owner == user.userId) {
            var deviceInfo = {
              'serial' : device.deviceId,
              'status' : 'online',
              'nodes'  : device.nodes
            }
            console.log('Device Client Matched');
            //user.emit('device-status', deviceInfo);
            device.emit('device-state', deviceInfo);
        }
    } );
}
// emit to device the state update from user
function matchAndChangeState(data) {
  console.log('Matching Device Client for changing state');
  _.each(deviceClients, function( device ) {
    if ( device.deviceId == data.serial) {
      console.log('Device Client Matched');
      device.emit('status', data);
    }
  } );
}

function matchAndUpdateStateOnUser(data) {
  console.log('Matching Device Client for changing state');
    _.each(userClients, function( client ) {
        if ( client.userId == data.owner) {
            var deviceInfo = {
              'serial' : data.serial,
              'status' : 'online',
              'nodes'  : data.nodes
            }
            console.log('User Client Matched');
            client.emit('device-status', deviceInfo);
        }
    } );
}
