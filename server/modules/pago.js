const connect  = require("../helpers/db/connect");
const {ObjectId} =require("mongodb");

export class pago extends connect {
    static instancePago;
    db;
    collection;
    constructor() {
        if (pago.instancePago) {
            return pago.instancePago;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('pago');
        pago.instancePago = this;
    }
    destructor(){
        pago.instancePago = undefined;
        connect.instanceConnect = undefined;
    }
    async getAllTest() {
        
        const res = await this.collection.find({}).toArray(); 
        
        return res;
    }
}