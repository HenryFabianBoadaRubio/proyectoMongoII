const express = require("express");
const pelicula = require("./js/modules/pelicula");;
const app = express();

const config={
    port:process.env.EXPRESS_PORT,
    host:process.env.EXPRESS_HOST,
}
//obtener la proyeccion de las peliculas
app.get("/pelicula", async(req, res, next)=>{
    try {
        let obj = new pelicula();
        const peliculas= await obj.getAllMoviesProjection()
        res.status(200).send(peliculas)
    } catch (error) {
        next(error);
    }

})

//obtener la informacion detallada de una pelicula 
//66a12e9a1219e115c8e79e89  el parametro para probar la pelicula
app.get("/pelicula/:id", async(req, res, next)=>{
    try {
        let obj = new pelicula();
        const peliculas= await obj.getAllMovieInformation(req.params.id)
        res.status(200).send(peliculas)
    } catch (error) {
        next(error);
    }
});



app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Error interno del servidor',
    });
});

app.listen(config.port, config.host, () => {
    console.log(`Server listening at http://${config.host}:${config.port}`)
})


