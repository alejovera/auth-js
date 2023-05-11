const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const boom = require('@hapi/boom');
const User = require('../models/User');
const { config } = require('../config');

const createHash = async (clave) => {
    return await bcrypt.hash(clave, 10);   
}

const compareHash = async (password, hash) => {
    return await bcrypt.compare(password, hash);   
}

const signToken = (payload, secret) => {
    return jwt.sign({userId: payload.userId, email: payload.usuario}, secret, {expiresIn: "2h"})
}

class UserService {
    constructor() {}

    async create(data) {
        const hash = await createHash(data.password);
        
        const newUser = new User({
            name: data.name,
            email: data.email,
            password: hash
        });

        const Usuario = await User.create({ 
                name: newUser.name, 
                email: newUser.email, 
                password: newUser.password
            })
            .then((myNewObject) => {
                return myNewObject;
            })
            .catch((err) => {
                throw boom.badImplementation('Usuario no se pudo crear' + err);
            })
        return Usuario;
    }

    async login(data) {
        const usuarioLog = await User.findOne({ email: data.email })
            .then(async (user) => {
                if(!user) {
                    throw boom.notFound('Usuario no encontrado');
                }
                else {
                    const isMatched = await compareHash(data.password, user.password);
                    if(!isMatched) {
                        throw boom.forbidden('Usuario no matchea password');
                    } else {
                        const token = signToken({userId: user.id, emaiL: user.email, name: user.name}, config.apiKey);
                        return token;
                    }
                }
            })
        return usuarioLog;
    }
}

module.exports = UserService;