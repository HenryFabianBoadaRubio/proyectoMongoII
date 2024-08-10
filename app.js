const express = require("express");
const pelicula = require("./server/modules/pelicula");;
const app = express();
const appPelicula= require("./server/routes/pelicula.routes");
const appBoleto = require("./server/routes/boleto.routes");
app.use(express.json());

const config={
    port:process.env.EXPRESS_PORT,
    host:process.env.EXPRESS_HOST,
    static: process.env.EXPRESS_STATIC
}

//peliculas
app.get("/pelicula", async(req, res) => {
    res.sendFile(`${config.static}/views/pelicula.html`, {root: __dirname})
})
app.use("/pelicula", appPelicula)



//boletos 
app.get("/boleto", async(req, res) => {
    res.sendFile(`${config.static}/views/boleto.html`, {root: __dirname})
})
app.use("/boleto", appBoleto)





app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Error interno del servidor',
    });
});

app.listen(config.port, config.host, () => {
    console.log(`Server listening at http://${config.host}:${config.port}`)
})


