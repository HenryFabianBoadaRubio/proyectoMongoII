const connect  = require("../../helpers/db/connect");
const {ObjectId} =require("mongodb");


export class proyeccion extends connect {
    static instanceProyeccion;
    db;
    collection;
    constructor() {
        if (proyeccion.instanceProyeccion) {
            return proyeccion.instanceProyeccion;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('proyeccion');
        proyeccion.instanceProyeccion = this;
    }
    destructor(){
        proyeccion.instanceProyeccion = undefined;
        connect.instanceConnect = undefined;
    }
    async getAllTest() {
        await this.conexion.connect();
        const res = await this.collection.find({}).toArray(); 
        await this.conexion.close();
        return res;
    }
}