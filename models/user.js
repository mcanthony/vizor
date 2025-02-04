var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true, lowercase: true },
	email: { type: String, required: true, unique: true, lowercase: true },
	password: String,

	facebook: String,
	twitter: String,
	google: String,
	github: String,
	instagram: String,
	linkedin: String,
	tokens: Array,

	profile:
	{
		gender: { type: String, default: '' },
		location: { type: String, default: '' },
		website: { type: String, default: '' },
		picture: { type: String, default: '' }
	},

	resetPasswordToken: String,
	resetPasswordExpires: Date
});

userSchema.pre('save', function(next)
{
	var user = this;

	if(!user.isModified('password'))
		return next();

	bcrypt.genSalt(5, function(err, salt)
	{
		if (err)
			return next(err);

 		bcrypt.hash(user.password, salt, null, function(err, hash)
		{
			if (err)
				return next(err);

 			user.password = hash;
			next();
		});
	});
});

userSchema.methods.toJSON = function()
{
	return {
		username: this.username
	};
};

userSchema.methods.comparePassword = function(candidatePassword, cb)
{
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch)
	{
		if (err)
			return cb(err);

 		cb(null, isMatch);
	});
}

userSchema.methods.gravatar = function(size)
{
	if (!size)
		size = 200;

 	if (!this.email)
	{
		return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
	}

 	var md5 = crypto.createHash('md5').update(this.email).digest('hex');

	return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}

module.exports = mongoose.model('User', userSchema);

