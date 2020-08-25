const jwt = require('jsonwebtoken');

const authorized  = function (req,res,next) {

    console.log(req.header('auth-token'));
    console.log(req.header('google-auth-token'));

    if (req.header('auth-token')) {
        const token = req.header('auth-token');

        if (!token) {
            return res.status(401).send('Access Denied');
        };

        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        } catch (err) {
            res.status(400).send('Invalid Token');
        };
    };

    if (req.header('google-auth-token')) {
        const token = req.header('google-auth-token');

        if (!token) {
            return res.status(401).send('Access Denied');
        };

        try {
            next();
        } catch (err) {
            res.status(400).send('Invalid Token');
        }
    }


};

module.exports = authorized;