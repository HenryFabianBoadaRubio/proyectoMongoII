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

        /**
     * Registra una nueva compra de boletos para una proyección específica, usuario y asientos.
     * También maneja el descuento VIP y las comprobaciones de disponibilidad de asientos.
     * @param {Object} params - Los parámetros para la compra de boletos.
     * @param {string} params.pelicula_id - El ID de la película.
     * @param {string} params.proyeccion_id - El ID de la proyección.
     * @param {string} params.usuario_id - El ID del usuario.
     * @param {Array} params.asientos - La lista de asientos a reservar. Cada asiento es un objeto con propiedades 'fila' y 'numero'.
     * @param {string} params.metodo_pago - El método de pago.
     * @returns {Object} - El resultado de la compra de boletos.
     * @returns {string} result.message - Un mensaje indicando el éxito o fracaso de la operación.
     * @returns {string} result.boleto_id - El ID del nuevo boleto creado.
     * @returns {string} result.descuento - El descuento aplicado, si lo hay.
     * @returns {Object} result.pago_registrado - Los detalles del pago registrado.
     * @returns {Object} result.error - Un objeto de error en caso de fracaso.
     * @returns {string} result.error.message - El mensaje de error.
     * @returns {Object} result.error.details - Los detalles adicionales del error.
     */
    async registerBuyTicket({pelicula_id,proyeccion_id,usuario_id,asientos,metodo_pago}) {
        let res;
        try {
            //verificar la existencia de la pelicula
            let peliExist=await this.db.collection('pelicula').findOne({_id: new ObjectId(pelicula_id)})
            if(!peliExist){
                return {
                    error: "Not found",
                    message: "La pelicula no existe."
                }
            }
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

            //verificar que la proyeccion sea de la pelicula
            if(!proExist.pelicula_id === peliExist.pelicula_id){
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
            for (let asiento of asientos){
                let asientoExist=await this.db.collection('asiento').findOne({fila:asiento.fila,numero:asiento.numero, sala_id: salaExist._id, estado: "disponible"})
                if(!asientoExist){
                    return {
                        error: "Not found",
                        message: "el asiento no está disponible: ",
                        asiento:asiento
                    }
                }
            }
            let precio_total= proExist.precio*asientos.length;
            let descuentoUser= 0;
            //verificar si el usuario es VIP y aplica el descuento en caso de serlo 
            let cardVip = await this.db.collection('tarjetaVIP').findOne({usuario_id: userExist._id})
            if (cardVip){
                precio_total=(proExist.precio - cardVip.descuento)*asientos.length;
                descuentoUser= cardVip.descuento*asientos.length;
                
            } 
           //ingresar el precio_total al boleto que se esta creando
            let nuevoBoleto={
                proyeccion_id: new ObjectId(proyeccion_id),
                usuario_id: new ObjectId(usuario_id),
                asientos:asientos,
                precio_total:precio_total,
                descuento_aplicado:descuentoUser
            }


              res= await this.collection.insertOne(nuevoBoleto);
            
              //cambiar el estado del asiento disponible a ocupado por la compra.
              for (let asiento of asientos){
                await this.db.collection('asiento').updateOne({fila:asiento.fila,numero:asiento.numero,},{$set:{estado: "ocupado"}});
              }

              //registrar un nuevo pago teniendo en cuenta el nuevo boleto
              let nuevoPago={
                boleto_id: res.insertedId,
                metodo_pago:metodo_pago,
                fecha_pago:new Date(),
                estado: "completado",
                monto: precio_total,
                
                
              }
              await this.db.collection('pago').insertOne(nuevoPago);

              return {
                    message: "Boleto registrado correctamente.",
                    boleto_id: res.insertedId,
                    descuento:(`Descuento aplicado: ${descuentoUser}`),
                    pago_registrado: nuevoPago
                };


          
            
        } catch (error) {
            return { error: "Error", message: error.message,details: error.errInfo};
        }
    }

}