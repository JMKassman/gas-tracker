const mongoose = require("mongoose")
const Schema = mongoose.Schema

const passportLocalMongoose = require("passport-local-mongoose")

const Session = new Schema({
    refreshToken: {
        type: String,
        default: "",
    }
})

const Refill = new Schema({
    gallons: {
        type: Number,
        min: 0,
        required: true,
    },
    total_price: {
        type: Number,
        min: 0,
        required: true,
    },
    miles: {
        type: Number,
        min: 0,
        required: true,
    },
    time: {
        type: Date, 
        default: Date.now,
    },
})

const User = new Schema({
    username: {
        type: String,
        default: "",
    },
    authStrategy: {
        type: String,
        default: "local"
    },
    refreshToken: {
        type: [Session]
    },
    refills: {
        type: [Refill]
    },
})

//remove refresh token from response
User.set("toJSON", {
    transform: function(doc, ret, options) {
        delete ret.refreshToken
        return ret
    },
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", User)