
import { ObjectId } from "mongodb";
import {connect} from "../proyectoMongoII/helpers/db/connect.js";
import { pelicula } from "./js/modules/pelicula.js";
import {practica} from './js/modules/practica.js'
import { boleto } from "./js/modules/boleto.js";


// let objPractica = new practica();
// console.log(`Probando conexion con la db`, await objPractica.getAllTest());
// objPractica.destructor();

/////////················································CASO DE USO 1 Selección de Películas:······································///////////
//parte 1 Listar Películas: 
// let objPelicula;
// objPelicula= new pelicula();

// console.log(await objPelicula.getAllMoviesProjection());
// objPelicula.destructor();


//Parte 2 Obtener Detalles de Película:
// console.log(await objPelicula.getAllMovieInformation(new ObjectId("66a12e9a1219e115c8e79e89")));


/////////
// objPelicula.destructor();
// /////////···············································FINAL Selección de Películas:······································///////////



/////////················································CASO DE USO 2 COMPRAR BOLETOS:······································///////////

let objBoleto;
objBoleto= new boleto()

//parte 1
console.log(await objBoleto.registerBuyTicket({
    pelicula_id:"66a12e9a1219e115c8e79e89",
    proyeccion_id:"66a12e9b1219e115c8e79e95",
    usuario_id: "66a12e9b1219e115c8e79e9b",
    asientos: [{fila: "A", numero: 1}],
    metodo_pago: "tarjeta_debito",
    

}));

// //parte 2

// console.log(await objBoleto.getAvailableSeats({proyeccion_id:"66a12e9b1219e115c8e79e95"}));
// objBoleto.destructor();
// /////////···············································FINAL COMPRAR BOLETO:······································///////////


/////////················································CASO DE USO 3 RESERVAR Asientos:······································///////////
// //parte 1

// let objBoleto;
// objBoleto= new boleto()

// console.log(await objBoleto.reserveSeats({
//     proyeccion_id:"66a12e9b1219e115c8e79e99",
//     usuario_id: "66a12e9b1219e115c8e79e9e",
//     asientos: [{fila: "C", numero: 2},{fila: "C", numero: 1}],
    
// }));
// objBoleto.destructor();

// //parte 2
// al momento de poner el id asegurarse de que exista.
// console.log(await objBoleto.cancelReservation(new ObjectId("11a6c94a180370662293a5bc")));

/////////················································CASO DE USO 3  Asientos······································///////////

