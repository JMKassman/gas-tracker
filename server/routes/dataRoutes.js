const express = require("express")
const router = express.Router()
const User = require("../models/user")
const passport = require("passport")
const jwt = require("jsonwebtoken")

const { verifyUser } = require("../authenticate")

router.get("/refills", verifyUser, (req, res, next) => {
    User.findById(req.user._id).then(
        user => {
            res.send(user.refills)
        },
        err => next(err)
    )
})

router.post("/newRefill", verifyUser, (req, res, next) => {
    const newRefill = req.body
    User.findById(req.user._id).then(
        user => {
            user.refills.push(newRefill)
            user.save((err, user) => {
                if (err) {
                    res.status(500).send(err)
                } else {
                    res.send({success: true})
                }
            })
        }, 
        err => next(err)
    )
})

module.exports = router