const connect  = require("../helpers/db/connect");
const {ObjectId} =require("mongodb");



export class asiento extends connect {
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
        await this.conexion.connect();
        const res = await this.collection.find({}).toArray(); 
        
        return res;
    }
}