const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require("passport")

if (process.env.NODE_ENV !== "production") {
    // load env variables from .env file in non prod
    // TODO: figure out how to do this in prod
    require('dotenv').config()
}

require("./utils/connectdb")

require("./strategies/JwtStrategy")
require("./strategies/LocalStrategy")
require("./authenticate")

const userRouter = require("./routes/userRoutes")
const dataRouter = require('./routes/dataRoutes')

const app = express()

app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

//add client url to cors policy
const whitelist = process.env.WHITELISTED_DOMAINS
    ? process.env.WHITELISTED_DOMAINS.split(",")
    : []

const corsOptions = {
    origin: function(origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}

app.use(cors(corsOptions))

app.use(passport.initialize())

app.use("/users", userRouter)
app.use("/data", dataRouter)

app.get("/", function(req, res) {
    res.send({status: "success"})
})

//start server on env.PORT or 8081
const server = app.listen(process.env.PORT || 8081, function() {
    const port = server.address().port
    console.log(`App started on port ${port}`)
})