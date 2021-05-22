const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

//Módulo para autenticação usando WebTokens JSON
module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = 'secret';
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

        User.getUserById(jwt_payload._id, (err, user) => {
            if (err) {
                return done(err, false);
            }

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }

        });

    }));
}
