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
mongoose.connect('mongodb://laser:laser10@kahana.mongohq.com:10050/vynci-test');
//mongoose.connect('mongodb://localhost/test-avayah2');
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
var clients = [];
module.exports.emitSocket = function(status){    
    _.each(clients, function( client ) {
        if ( client.deviceId == status.info[0].serial) {
            client.emit('status', status);
        }
    } );
    console.log(status);
}

io.sockets.on('connection', function (socket) { 

    socket.on('device-info', function (data) {        
        socket.deviceId = data;
        clients.push(socket);   
        console.log('client: ' + socket.deviceId + ' connected');
        console.log('number of devices: ' + clients.length);
    });

    socket.on('disconnect', function() {
        var index = clients.indexOf(socket);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client gone (id=' + socket.id + ').');
        }
    });

});
