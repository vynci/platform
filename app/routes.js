var home = require('../controllers/home'),
    devices = require('../controllers/devices');

module.exports.initialize = function(app, passport) {
    //app.get('/home', home.index);
    app.get('/', home.index);
    app.get('/api/devices', devices.index);
    app.get('/api/devices/:id', devices.getById);
    app.get('/api/devicesByOwner/:owner', devices.getByOwner);
    app.post('/api/devices', devices.add);
    app.put('/api/devices/:id', devices.update);
    app.delete('/api/devices/:id', devices.delete);

    app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/home', isLoggedIn, function(req, res) {		
		res.render('index');
	});	

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/#home', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.get('/api/auth', isLoggedIn, function(req, res) {		
		res.send(req.user)
	});	

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/#add', // redirect to the secure profile section
		failureRedirect : '/#signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));	
};

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}