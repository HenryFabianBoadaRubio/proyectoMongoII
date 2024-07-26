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

    async registerBuyTicket({proyeccion_id,usuario_id,asientos,precio_total,descuento_aplicado}) {
        let res;
        try {
            // verificar la existencia de usuario 
            let userExist=await this.db.collection('usuario').findOne({_id: new ObjectId(usuario_id)})
            if(!userExist){
                return {
                    error: "Not found",
                    message: "El usuario no existe."
                };
            }

            // verificar la existencia de la proyeccion
            let proExist= await this.db.collection('proyeccion').findOne({_id: new ObjectId(proyeccion_id)})
            if (!proExist){
                return {
                    error: "Not found",
                    message: "La proyeccion no existe."
                };
            }
            //verificar la existencia de asientos.
            let asientoExist=await this.db.collection('asiento').findOne({fila:fila,numero:numero})
            if (!asientoExist){
                return {
                    error: "Not found",
                    message: "El asiento no existe."
                };
            }

            let nuevoBoleto={
                proyeccion_id: new ObjectId(proyeccion_id),
                usuario_id: new ObjectId(usuario_id),
                asientos:asientos,
                precio_total:precio_total,
                descuento_aplicado:descuento_aplicado
            }
            await this.db.collection('boleto').u
          
            
        } catch (error) {
            return { error: "Error", message: error.message,details: error.errInfo};
        }
    }

}