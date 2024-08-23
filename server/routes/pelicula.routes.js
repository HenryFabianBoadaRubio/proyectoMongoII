const express = require("express");
const pelicula = require("../modules/pelicula");
const appPelicula = express.Router();


//obtener la proyeccion de las peliculas
appPelicula.get("/todasPeliculas", async(req, res, next)=>{
    let obj = new pelicula();
    try {
        const peliculas= await obj.getAllMoviesProjection()
        res.status(200).send(peliculas)
    } catch (error) {
        next(error);
    }
    finally{
        obj.destructor();
    }

})

//obtener la informacion detallada de una pelicula 
//66a12e9a1219e115c8e79e89  el parametro para probar la pelicula
appPelicula.get("/unaPelicula/:id", async(req, res, next)=>{
    let obj = new pelicula();
    try {
        const peliculas= await obj.getAllMovieInformation({id:req.params.id})
        res.status(200).send(peliculas)
    } catch (error) {
        next(error);
    }
    finally{
        obj.destructor();
    }
});



// Obtener la información detallada de una película con sus proyecciones
appPelicula.get("/proyeccion/:id", async(req, res, next) => {
    let obj = new pelicula();
    try {
        const peliculas = await obj.getMovieProjectionsById({ id: req.params.id });
        res.status(200).send(peliculas);
    } catch (error) {
        next(error);
    }
    finally{
        obj.destructor();
    }
});

module.exports= appPelicula