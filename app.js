
/**
 * Module dependencies.
 */
var express  = require('express');
var connect  = require('connect');
var session  = require('express-session');
var flash    = require('connect-flash');
var app      = express();
var port     = process.env.PORT || 8080;

var multer   = require('multer');
var https    = require('https');
var fs       = require('fs');
var bodyParser  = require('body-parser')

// Configuration
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/sweetalert2'));
app.use(connect.logger('dev'));
app.use(connect.json());
app.use(connect.urlencoded());
app.use(session({ secret: 'TassoDelivery',
		resave: true,
    		saveUninitialized: true
 }));

app.use(bodyParser.json());

app.use(flash());

require('./routes/company.js')(app);
require('./routes/showcase.js')(app);
require('./routes/authentication.js')(app);
require('./routes/compte.js')(app);
require('./routes/menu.js')(app);
require('./routes/mobile_courier.js')(app);
require('./routes/mobile_client.js')(app);
require('./routes/track.js')(app);
require('./routes/paymentcourses.js')(app);
require('./routes/wallet.js')(app);
require('./routes/history.js')(app);
require('./routes/admin.js')(app);


app.listen(port)
// https.createServer(options, app).listen(porthttps);

console.log('The App runs on port :'+port);
