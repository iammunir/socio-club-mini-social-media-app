const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const keyword = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, keyword);
        req.userData = {userId: decodedToken.userId, username: decodedToken.username, email: decodedToken.email};
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Access Denied!'
        })
    }
};