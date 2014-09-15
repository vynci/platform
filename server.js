var express      = require('express');
var http         = require('http');
var path         = require('path');
var routes       = require('./app/routes');
var exphbs       = require('express3-handlebars');
var mongoose     = require('mongoose');
var seeder       = require('./app/seeder');
var app          = express();
var socket       = require('socket.io');
var passport     = require('passport');
var flash        = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');    

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
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");

    // check if the db is empty, if so seed it with some data:
    seeder.check();
});

//routes list:
routes.initialize(app, passport);

require('./config/passport')(passport); // pass passport for configuration

//finally boot up the server:
var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});

var io = socket.listen(server);

module.exports.emitSocket = function(status){
    io.sockets.emit('status', status);
    console.log(status);
}

io.sockets.on('connection', function (socket) {    
    io.sockets.emit('status', { status: 'hello world' }); // note the use of io.sockets to emit but socket.on to listen
    socket.on('reset', function (data) {
        status = "War is imminent!";
        io.sockets.emit('status', { status: 'test' });
    });

});
