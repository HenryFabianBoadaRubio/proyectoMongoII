
import {connect} from "../proyectoMongoII/helpers/db/connect.js";
import { pelicula } from "./js/modules/pelicula.js";
import {practica} from './js/modules/practica.js'


// let objPractica = new practica();
// console.log(`Probando conexion con la db`, await objPractica.getAllTest());
// objPractica.destructor();


let objPelicula;
objPelicula= new pelicula();

//Selección de Películas:
//parte 1: 
console.log(await objPelicula.getAllMoviesProjection());
objPelicula.destructor();