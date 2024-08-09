const express = require("express");
const pelicula = require("../modules/pelicula");;
const appPelicula = express.Router();


//obtener la proyeccion de las peliculas
appPelicula.get("/todasPeliculas", async(req, res, next)=>{
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
appPelicula.get("/unaPelicula/:id", async(req, res, next)=>{
    try {
        let obj = new pelicula();
        const peliculas= await obj.getAllMovieInformation(req.params.id)
        res.status(200).send(peliculas)
    } catch (error) {
        next(error);
    }
});

module.exports= appPelicula