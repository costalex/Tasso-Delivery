var multer = require("multer");
var profile = require('../config/profile');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'upload/')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '_' + file.originalname + '-' + Date.now() + '.png')
	}
})

var upload = multer({ storage: storage })
var User = require('../config/models/user');

module.exports = function(app) {

app.get('/profile', checkLogin, function(req, res) {
	User.findOne({'_id' : req.session.user_id},function(err,user) {
		if (user != null)
		res.render('compte/profile.ejs', {
			user : user.details,balance: user.wallet.balance, message: req.flash('FaillureProfile'), type: req.flash.type // get the user out of session and pass to template
		});
	});
});

app.post('/profile', checkLogin, function(req, res) {
	profile.edit_profile(req, function(result) {
	profile.edit_password(req, function(result) {
		res.redirect('/profile');
			});
		 });
});
}

function checkLogin(req, res, next) {
	if(req.session.user_id)
	return next();
	res.redirect('/');
}
