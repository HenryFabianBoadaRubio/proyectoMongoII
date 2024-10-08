const connect  = require("../helpers/db/connect");
const {ObjectId} =require("mongodb");


module.exports=class boleto extends connect {
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
        
        const res = await this.collection.find({}).toArray(); 
        
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
    async registerBuyTicket({pelicula_id, proyeccion_id,usuario_id,asientos,total_pago,numero_orden}) {
        console.log("Iniciando registerBuyTicket con:", { pelicula_id, proyeccion_id, usuario_id, asientos,total_pago});
        let res;    
        // const +=localStorage.getItem('precio__pagar')
        //validar los parámetros
        if( !pelicula_id ||  !proyeccion_id || !usuario_id || !asientos || !total_pago || !numero_orden) {
            return {
                error: "Faltan parámetros requeridos",
                missingParams: [
                    !pelicula_id ? "pelicula_id" : null,
                    !proyeccion_id ? "proyeccion_id" : null,
                    !usuario_id ? "usuario_id" : null,
                    !asientos ? "asientos" : null,
                    !total_pago ? "total_pago" : null,
                    !numero_orden ? "numero_orden": null,
                    // !metodo_pago ? "metodo_pago" : null
                ].filter(Boolean)
            }
        }

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
            // //verificar la disponibilidad de los asientos de la sala 
            // for (let asiento of asientos){
            //     let asientoExist=await this.db.collection('boleto').findOne({fila:asiento.fila,numero:asiento.numero, sala_id: salaExist._id})
            //     if(!asientoExist){
            //         return {
            //             error: "Not found",
            //             message: "el asiento no está disponible: ",
            //             asiento:asiento
            //         }
            //     }
            // }
                    // Verificar la disponibilidad de los asientos en la colección de boletos
            for (let asiento of asientos) {
                // Buscar si algún boleto ya tiene reservado el asiento para la misma proyección
                let asientoOcupado = await this.db.collection('boleto').findOne({
                    proyeccion_id: proExist._id, // Suponiendo que tienes acceso a la proyección actual
                    asientos: {
                        $elemMatch: {
                            fila: asiento.fila,
                            numero: asiento.numero
                        }
                    }
                });

                if (asientoOcupado) {
                    return {
                        error: "Not available",
                        message: "El asiento ya está ocupado: ",
                        asiento: asiento
                    };
                }
            }

            //verificamos si el user tiene tarjeta vip y que descuento aplica sino tiene pasa como user estandar
            let precio_total =total_pago;
            let descuentoUser = 0;
            let cardVip = await this.db.collection('tarjetaVIP').findOne({usuario_id: userExist._id})
            if (cardVip) {
                // Verificar que la tarjeta VIP esté activa
                if (cardVip.estado === "activa") {
                    // Aplicar descuento
                     descuentoUser = cardVip.descuento ;
                     precio_total = (total_pago - cardVip.descuento);
                    
                    
                }
            }
           //ingresar el precio_total al boleto que se esta creando
            let nuevoBoleto={
                proyeccion_id: new ObjectId(proyeccion_id),
                usuario_id: new ObjectId(usuario_id),
                asientos:asientos,
                precio_total:precio_total,
                descuento_aplicado:descuentoUser,
                numero_orden:numero_orden
            }


              res= await this.collection.insertOne(nuevoBoleto);
            
            //   //cambiar el estado del asiento disponible a ocupado por la compra.
            //   for (let asiento of asientos){
            //     await this.db.collection('asiento').updateOne({fila:asiento.fila,numero:asiento.numero,},{$set:{estado: "ocupado"}});
            //   }

              //registrar un nuevo pago teniendo en cuenta el nuevo boleto
              let nuevoPago={
                boleto_id: res.insertedId,
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
        /**
    Obtiene los asientos disponibles para una proyección dada.
    @param {Object} params - Los parámetros de la función.
    @param {string} params.proyeccion_id - El ID de la proyección.
    @returns {Object} - El resultado de la operación.
    @returns {Array} result.asientosDisponibles - Un array de strings que representan los asientos disponibles en la forma 'filaNumero'.
    @returns {Object} result.error - Un objeto de error en caso de fracaso.
    @returns {string} result.error.message - El mensaje de error.
    */
    async getAvailableSeats({ proyeccion_id }) {
        try {
            // Verificar si la proyección existe
            const proExist = await this.db.collection('proyeccion').findOne({ _id: new ObjectId(proyeccion_id) });
            if (!proExist) {
                return { error: "Not found", message: `La proyección con id ${proyeccion_id} no existe.` };
            }
    
            // Obtener todos los asientos de la sala
            const seats = await this.db.collection('asiento').find({ sala_id: proExist.sala_id }).toArray();
    
            // Obtener los boletos para esta proyección
            const boletos = await this.db.collection('boleto').find({ proyeccion_id: new ObjectId(proyeccion_id) }).toArray();
    
            // Obtener los asientos no disponibles
            const asientosNoDisponibles = boletos.flatMap(boleto => 
                boleto.asientos.map(asiento => `${asiento.fila}${asiento.numero}`)
            );
    
            // Filtrar los asientos disponibles
            const availableSeats = seats.filter(seat => 
                !asientosNoDisponibles.includes(`${seat.fila}${seat.numero}`)
            );
            
            return {
                asientosDisponibles: availableSeats.map(seat =>` ${seat.fila}${seat.numero}`)
               
            };
    
        } catch (error) {
            console.error("Error en getAvailableSeats:", error);
            throw error;
        }
    }

        /**
     * Reserva asientos para una proyección específica, usuario y asientos.
     * También maneja el descuento VIP y las comprobaciones de disponibilidad de asientos.
     * @param {Object} params - Los parámetros para la reserva de boletos.
     * @param {string} params.proyeccion_id - El ID de la proyección.
     * @param {string} params.usuario_id - El ID del usuario.
     * @param {Array} params.asientos - La lista de asientos a reservar. Cada asiento es un objeto con propiedades 'fila' y 'numero'.
     * @returns {Object} - El resultado de la reserva de boletos.
     * @returns {string} result.message - Un mensaje indicando el éxito o fracaso de la operación.
     * @returns {string} result.boleto_id - El ID del nuevo boleto creado.
     * @returns {string} result.descuento - El descuento aplicado, si lo hay.
     * @returns {Object} result.error - Un objeto de error en caso de fracaso.
     * @returns {string} result.error.message - El mensaje de error.
     * @returns {Object} result.error.details - Los detalles adicionales del error.
     */
    async reserveSeats({proyeccion_id,usuario_id,asientos,}){
        let res;
        try { 
             //verificar la existencia de la proyeccion
            let proExist=await this.db.collection('proyeccion').findOne({_id: new ObjectId(proyeccion_id)})
            if (!proExist){
                return {
                    error: "Not found",
                    message: "La proyeccion no existe."
                };
            }
            //verificar la existencia de usuario.
            let userExist=await this.db.collection('usuario').findOne({_id: new ObjectId(usuario_id)})
            if(!userExist){
                return {
                    error: "Not found",
                    message: "El usuario no existe."
                };
            }
          
           //verificar si la sala existe
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
                        message: "el asiento no está disponible O no existe. ",
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
            // registrar el nuevo boleto de reserva
            let nuevoBoleto={
                proyeccion_id: new ObjectId(proyeccion_id),
                usuario_id: new ObjectId(usuario_id),
                asientos:asientos,
                precio_total:precio_total,
                descuento_aplicado:descuentoUser
            }

             res= await this.collection.insertOne(nuevoBoleto);
             for (let asiento of asientos){
                await this.db.collection('asiento').updateOne({fila:asiento.fila,numero:asiento.numero,},{$set:{estado: "reservado"}});
              }
              return {
                    message: "Boleto reservado correctamente.",
                    boleto_id: res.insertedId,
                    descuento:(`Descuento aplicado: ${descuentoUser}`)
                };
        } catch (error) {
            return { error: "Error", message: error.message,details: error.errInfo};
            
        }
    }
    /**
 * Cancela una reservación de un boleto de película.
 * 
 * @param {string} _id - El ID de la reservación del boleto a cancelar.
 * @returns {Object} - El resultado de la operación de cancelación.
 * @returns {string} result.message - Un mensaje que indica el éxito o fracaso de la operación.
 * @returns {string} result.boleto_id - El ID del boleto cancelado.
 * @returns {Object} result.error - Un objeto de error en caso de fracaso.
 * @returns {string} result.error.message - El mensaje de error.
 * @returns {Object} result.error.details - Los detalles adicionales del error.
 */
    async cancelReservation({_id}){
        let res;
     
            // Verificar si el boleto existe
            let boletoExist = await this.db.collection('boleto').findOne({_id: new ObjectId(_id)});
            if (!boletoExist) {
                return {
                    error: "Not found",
                    message: "El boleto no existe."
                };
            }
    
            // Eliminar el boleto
            res = await this.db.collection('boleto').deleteOne({_id: new ObjectId(boletoExist._id)});
            if (res.deletedCount === 1) {
                // Cambiar el estado de los asientos a disponible
                for (let asiento of boletoExist.asientos) {
                    await this.db.collection('asiento').updateOne(
                        { fila: asiento.fila, numero: asiento.numero },
                        { $set: { estado: "disponible" } }
                    );
                }
                return {
                    message: "Boleto y asientos cancelados correctamente.",
                    boleto_id: boletoExist._id
                };
            } else {
                return {
                    error: "Error",
                    message: "No se pudo eliminar el boleto."
                };
            }
        
    }
    async obtenerBoletosConDetalles(id_usuario) {
        try {
            await this.conexion.connect();
    
            // Buscar todos los boletos asociados al id_usuario
            

            // Dentro del método obtenerBoletosConDetalles
            const boletos = await this.collection.find({ usuario_id: new ObjectId(id_usuario) }).toArray();
            
    
            // Verificar si se encontraron boletos
            if (boletos.length === 0) {
                return { mensaje: `No se encontraron boletos para el usuario con ID ${id_usuario}.` };
            }
    
            // Obtener las colecciones de proyeccion y asiento
            const proyeccionCollection = this.db.collection('proyeccion');
            // const asientoCollection = this.db.collection('asiento');
    
            // Iterar sobre los boletos para buscar detalles de proyeccion y asiento
            const boletosConDetalles = await Promise.all(boletos.map(async (boleto) => {
                // Buscar la proyección asociada al id_proyeccion del boleto
                const proyeccion = await proyeccionCollection.findOne({ _id: boleto.proyeccion_id });
                
           
                return {
                    ...boleto,
                    fecha: proyeccion ? proyeccion.fecha : null,
                    // hora: proyeccion ? proyeccion.hora : null,
                    id_pelicula: proyeccion ? proyeccion.pelicula_id : null, // Añadir id_pelicula
                   
                };
            }));
    
            return boletosConDetalles;
        } catch (error) {
            return { error: `Error al obtener los boletos, proyecciones y asientos para el usuario con ID ${id_usuario}: ${error.message}` };
        }
    }
    

}