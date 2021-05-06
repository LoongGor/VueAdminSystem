//解密配置
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
const mongoose = require('mongoose');
const User = mongoose.model('users')
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

module.exports = passport => {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        // console.log( 789 )
        console.log( 'jwt_payload=>',jwt_payload )

        User.findById(jwt_payload.id)
            .then(user=>{
                console.log('passportUser==>',user)
                if( user ){
                    return done(null,user )
                }
                return done(null, false);
            })
            .catch(err=>{console.log( err )})
    }));
}