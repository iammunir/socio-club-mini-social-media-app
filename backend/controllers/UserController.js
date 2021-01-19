const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signupUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const userData = new User({
                email: req.body.email,
                password: hash
            });
            userData.save()
                .then(response => {
                    res.status(201).json({
                        message: 'user has been created',
                        result: response
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Invalid authentication credentials!'
                    });
                })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Invalid authentication credentials!'
            })
        })
};

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'Email is not registered!'
                })
            } else {
                fetchedUser = user;
                return bcrypt.compare(req.body.password, user.password);
            }
        })
        .then(match => {
            if (!match) {
                return res.status(401).json({
                    message: 'Email or password is incorrect'
                })
            }

            const keyword = process.env.JWT_SECRET;
            const token = jwt.sign(
                {userId: fetchedUser._id, email: fetchedUser.email},
                keyword,
                {expiresIn: '1hr'}
            );
            
            res.status(200).json({
                token,
                expiresIn: 3600,
                userId: fetchedUser._id
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Authentication failed'
            })
        })
};