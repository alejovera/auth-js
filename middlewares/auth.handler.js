const boom = require('@hapi/boom');
const jwt = require("jsonwebtoken");
const { config } = require('../config');

function checkApiKey(req, res, next) {
    const apiKey = req.headers['api'];
    if (apiKey === '123') {
        next();
    } else {
        next(boom.unauthorized());
    }
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null)
        return res.status(401).send("Token requerido");
    jwt.verify(token, config.apiKey, (err, user) => {
        if(err) return res.status(403).send("Token invalido");
        console.log(user);
        req.user = user;
        next();
    });
}


module.exports = { checkApiKey, verifyToken }