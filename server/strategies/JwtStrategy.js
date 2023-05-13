const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("../models/user")

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

//used to get user info using the jwt
passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
        User.findById(jwt_payload._id).exec().then((user) => {
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        }).catch((err) => {
            return done(err, false)
        })
    })
)