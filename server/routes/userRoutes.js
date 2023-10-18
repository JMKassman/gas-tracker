const express = require("express")
const router = express.Router()
const User = require("../models/user")
const passport = require("passport")
const jwt = require("jsonwebtoken")

const {
    getToken,
    COOKIE_OPTIONS,
    getRefreshToken,
    verifyUser
} = require("../authenticate")

router.post("/signup", (req, res, next) => {
    User.register(
        new User({
            username: req.body.username
        }),
        req.body.password,
        (err, user) => {
            if (err) {
                res.status(400).send(err)
            } else {
                const token = getToken({
                    _id: user._id
                })
                const refreshToken = getRefreshToken({
                    _id: user._id
                })
                user.refreshToken.push({
                    refreshToken
                })
                user.save().then(user => {
                    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                    res.send({
                        success: true,
                        token
                    })
                }).catch(err => { res.status(500).send(err) })
            }
        }
    )
})

router.post("/login", passport.authenticate("local", {
    session: false
}), (req, res, next) => {
    const token = getToken({
        _id: req.user._id
    })
    const refreshToken = getRefreshToken({
        _id: req.user._id
    })
    User.findById(req.user._id).then(user => {
        user.refreshToken.push({
            refreshToken
        })
        user.save().then((user) => {
            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
            res.send({
                success: true,
                token
            })
        }).catch((err) => {
            res.status(500).send(err)
        })
    },
        err => next(err)
    )
})

router.post("/refreshToken", (req, res, next) => {
    const {
        signedCookies = {}
    } = req
    const {
        refreshToken
    } = signedCookies
    if (refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const userId = payload._id
            User.findOne({
                _id: userId
            }).then(user => {
                if (user) {
                    const tokenIndex = user.refreshToken.findIndex(
                        item => item.refreshToken === refreshToken
                    )
                    if (tokenIndex === -1) {
                        res.sendStatus(401)
                    } else {
                        const token = getToken({
                            _id: userId
                        })
                        const newRefreshToken = getRefreshToken({
                            _id: userId
                        })
                        user.refreshToken[tokenIndex] = {
                            refreshToken: newRefreshToken
                        }
                        user.save().then((user) => {
                            res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
                            res.send({
                                success: true,
                                token
                            })
                        }).catch((err) => {
                            res.status(500).send(err)
                        })
                    }
                } else {
                    res.sendStatus(401)
                }
            },
                err => next(err)
            )
        } catch (err) {
            res.sendStatus(401)
        }
    } else {
        res.sendStatus(401)
    }
})

router.get("/logout", verifyUser, (req, res, next) => {
    const {
        signedCookies = {}
    } = req
    const {
        refreshToken
    } = signedCookies
    User.findById(req.user._id).then(
        user => {
            const tokenIndex = user.refreshToken.findIndex(
                item => item.refreshToken === refreshToken
            )

            if (tokenIndex !== -1) {
                User.findByIdAndDelete(user.refreshToken[tokenIndex]._id)
            }

            user.save().then((user) => {
                res.clearCookie("refreshToken", COOKIE_OPTIONS)
                res.send({
                    success: true
                })
            }).catch((err) => {
                res.status(500).send(err)
            })
        },
        err => next(err)
    )
})

router.get("/me", verifyUser, (req, res, next) => {
    res.send(req.user)
})

module.exports = router