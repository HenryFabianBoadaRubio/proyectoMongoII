const express = require("express");
const cors= require("cors");
// const path= require("path")
const app = express();
app.use(express.static(process.env.EXPRESS_STATIC))
app.use(cors());
const pelicula = require("./server/modules/pelicula");
const appPelicula= require("./server/routes/pelicula.routes");
const appBoleto = require("./server/routes/boleto.routes");
const appUsuario = require("./server/routes/usuario.routes");
const appAsiento = require("./server/routes/asiento.routes");
app.use(express.json());

app.use(express.static(__dirname));// // Sirve archivos estáticos desde la raíz del proyecto esto lo puse para el error del favicon nada mas.


// const config={
//     port:process.env.EXPRESS_PORT,
//     host:process.env.EXPRESS_HOST,
//     static: process.env.EXPRESS_STATIC
// }
app.get("/", async(req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/index.html`, {root: __dirname})
})
// //peliculas
app.get("/pelicula", async(req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/pelicula.html`, {root: __dirname})
})
app.use("/pelicula", appPelicula)



// //boletos 
app.get("/boleto", async(req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/boleto.html`, {root: __dirname})
})
app.use("/boleto", appBoleto)


// // asiento
app.get("/asiento", async(req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/asiento.html`, {root: __dirname})
})
app.use("/asiento", appAsiento)



// //usuarios
app.use("/usuario", appUsuario)




app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Error interno del servidor',
    });
});

// app.listen(config.port, config.host, () => {
//     console.log(`Server listening at http://${config.host}:${config.port}`)
// })



app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT}, () => {
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
})