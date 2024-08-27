const connect  = require("../helpers/db/connect");
const {ObjectId} =require("mongodb");



module.exports=class asiento extends connect {
    static instanceAsiento;
    db;
    collection;
    constructor() {
        if (asiento.instanceAsiento) {
            return asiento.instanceAsiento;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('asiento');
        asiento.instanceAsiento = this;
    }
    destructor(){
        asiento.instanceAsiento = undefined;
        connect.instanceConnect = undefined;
    }
    async getAllTest() {
       
        const res = await this.collection.find({}).toArray(); 
        
        return res;
    }
    /**
 * Obtiene los asientos disponibles para una proyección dada.
 * @param {Object} params - Los parámetros de la función.
 * @param {string} params.proyeccion_id - El ID de la proyección.
 * @returns {Object} - El resultado de la operación.
 * @returns {Array} result.asientos - Un array de objetos que representan los asientos y su disponibilidad.
 * @returns {Object} result.error - Un objeto de error en caso de fracaso.
 * @returns {string} result.error.message - El mensaje de error.
 */
async getAvailableSeats({ proyeccion_id }) {
    try {
        // Verificar si la proyección existe
        const proExist = await this.db.collection('proyeccion').findOne({ _id: new ObjectId(proyeccion_id) });
        if (!proExist) {
            return { error: { message: `La proyección con id ${proyeccion_id} no existe.` } };
        }

        // Obtener todos los asientos de la sala
        const seats = await this.db.collection('asiento').find({ sala_id: proExist.sala_id }).toArray();

        // Obtener los boletos para esta proyección
        const boletos = await this.db.collection('boleto').find({ proyeccion_id: new ObjectId(proyeccion_id) }).toArray();

        // Obtener los asientos ocupados
        const asientosOcupados = boletos.flatMap(boleto => 
            boleto.asientos.map(asiento => `${asiento.fila}${asiento.numero}`)
        );

        // Marcar los asientos como disponibles o ocupados
        const asientos = seats.map(seat => ({
            fila: seat.fila,
            numero: seat.numero,
            disponible: !asientosOcupados.includes(`${seat.fila}${seat.numero}`)
        }));

        return { asientos };
    } catch (error) {
        console.error("Error en getAvailableSeats:", error);
        return { error: { message: error.message } };
    }
}

}