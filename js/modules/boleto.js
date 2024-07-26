import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

export class boleto extends connect {
    static instanceBoleto;
    db;
    collection;
    constructor() {
        if (boleto.instanceBoleto) {
            return boleto.instanceBoleto;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('boleto');
        boleto.instanceBoleto = this;
    }
    destructor(){
        boleto.instanceBoleto = undefined;
        connect.instanceConnect = undefined;
    }
    async getAllTest() {
        await this.conexion.connect();
        const res = await this.collection.find({}).toArray(); 
        await this.conexion.close();
        return res;
    }
    // ,{proyeccion_id,usuario_id,asientos,precio_total,descuento_aplicado}
    async registerBuyTicket(id) {
        let res;
        try {
            //verificar la existencia de la pelicula
            let peliExist=await this.db.collection('pelicula').findOne({_id: new ObjectId(id._id)})
            if(!peliExist){
                return {
                    error: "Not found",
                    message: "La pelicula no existe."
                }
            }
            // verificar la existencia de usuario 
            let userExist=await this.db.collection('usuario').findOne({_id: new ObjectId(id.usuario_id)})
            if(!userExist){
                return {
                    error: "Not found",
                    message: "El usuario no existe."
                };
            }

            // verificar la existencia de la proyeccion
            let proExist= await this.db.collection('proyeccion').findOne({_id: new ObjectId(id.proyeccion_id)})
            if (!proExist){
                return {
                    error: "Not found",
                    message: "La proyeccion no existe."
                };
            }

            //verificar que la proyeccion sea de la pelicula
            if(!proExist.pelicula_id === peliExist._id){
                return {
                    error: "Not found",
                    message: "La proyeccion no es de la pelicula."
                };
            }
           
            //verificar si la sala existe.
            let salaExist=await this.db.collection('sala').findOne({_id: proExist.sala_id})
            if (!salaExist) {
                return {
                    error: "Not found",
                    message: "La sala no existe."
                };
            }
            //verificar la disponibilidad de los asientos de la sala 
           // Obtiene los asientos correspondientes al arreglo de asientos en salaExist
            const asientosIds = salaExist.asientos.map(asiento => asiento.asiento_id);
           
            // Consulta la base de datos para obtener el estado de cada asiento
            const asientosDisponibles = await Promise.all(asientosIds.map(async (id) => {
                return this.db.collection('asiento').findOne({ _id: id });
            }));
            // Verifica si todos los asientos están disponibles
            const todosDisponibles = asientosDisponibles.every(asiento => asiento.estado === "disponible");
            
            if (!todosDisponibles) {
                return {
                    error: "Not found",
                    message: "Algunos asientos no están disponibles"
                };
            }


            //verificar si el usuario es VIP
           let usuarioVip = await this.db.collection('tarjetaVIP').findOne({usuario_id: userExist._id})
           if (!usuarioVip){
            return {
                error: "Not found",
                message: "El usuario no tiene tarjeta VIP."
            };
           }

            let nuevoBoleto={
                proyeccion_id: new ObjectId(id.proyeccion_id),
                usuario_id: new ObjectId(id.usuario_id),
                asientos:id.asientos,
                precio_total:id.precio_total,
                descuento_aplicado:id.descuento_aplicado
            }


              res= await this.collection.insertOne(nuevoBoleto);
            
              //cambia el estado de los asientos que se ocupen 
              await Promise.all(asientosIds.map(async (id) => {
                await this.db.collection('asiento').updateOne(
                    { _id: id },
                    { $set: { estado: "ocupado" } }  // Cambia el estado a "ocupado"
                );
            }));

              return {
                    message: "Boleto registrado correctamente.",
                    boleto_id: res.insertedId
                };
          
            
        } catch (error) {
            return { error: "Error", message: error.message,details: error.errInfo};
        }
    }

}