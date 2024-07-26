
import { ObjectId } from "mongodb";
import {connect} from "../proyectoMongoII/helpers/db/connect.js";
import { pelicula } from "./js/modules/pelicula.js";
import {practica} from './js/modules/practica.js'
import { boleto } from "./js/modules/boleto.js";


// let objPractica = new practica();
// console.log(`Probando conexion con la db`, await objPractica.getAllTest());
// objPractica.destructor();

/////////················································CASO DE USO 1 Selección de Películas:······································///////////
// let objPelicula;
// objPelicula= new pelicula();

//parte 1 Listar Películas: 
// console.log(await objPelicula.getAllMoviesProjection());



//Parte 2 Obtener Detalles de Película:
// console.log(await objPelicula.getAllMovieInformation(new ObjectId("66a12e9a1219e115c8e79e89")));

// objPelicula.destructor();
// /////////···············································FINAL Selección de Películas:······································///////////



let objBoleto;
objBoleto= new boleto()

console.log(await objBoleto.registerBuyTicket({
    _id:"66a12e9a1219e115c8e79e89",
    proyeccion_id:"66a12e9b1219e115c8e79e95",
    usuario_id: "66a12e9b1219e115c8e79e9b",
    asientos: [{fila: "A", numero: 1}],
    precio_total: 100,
    descuento_aplicado: 50
}));