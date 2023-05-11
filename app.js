const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserService = require('./services/user.service');
const service = new UserService();

const uri = 'mongodb+srv://alejovera:9c8txgtEeN8fqPoV@jwt-tokens.owbkbds.mongodb.net/?retryWrites=true&w=majority'

async function connect () {
    try {
        await mongoose.connect(uri);
        console.log("connected to mongodb")
    }
    catch (err) {
        console.log(err)
    }
}
connect();

const { config } = require('./config');
const { boomErrorHandler, logErrors, errorHandler } = require('./middlewares/error.handler')
const { checkApiKey, verifyToken } = require('./middlewares/auth.handler');

const app = express();
app.use(express.json());
app.use(cors());

app.post("/usuario/register", checkApiKey, async (req, res) => {
    try {
        const body = req.body;
        const newUser = await service.create(body);
        res.status(201).json(newUser);
    }
    catch (err) {
        console.log("Error creating object" + err);
        res.status(500).json(err);
    }
})


app.post("/usuario/login", checkApiKey, async (req, res, next) => {
    try{
        const body = req.body;
        const loginUser = await service.login(body);
        console.log(loginUser);
        res.status(200).json(loginUser);
    } catch (err) {
        next(err);
    }
});

app.get("/usuario/:id/ventas", verifyToken, (req, res) => {
    const datos = [
        {
            id: 1,
            cliente: "Empresa A",
            total: 2250,
            fecha: "2022-01-15"
        },
        {
            id: 2,
            cliente: "Empresa B",
            total: 1000,
            fecha: "2022-01-16"
        },
        {
            id: 3,
            cliente: "Empresa A",
            total: 5000,
            fecha: "2022-01-17"
        }
    ];
    res.json(datos);
});


app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log("Arranca Servidor")
})