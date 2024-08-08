const connect  = require("../helpers/db/connect");
const {ObjectId} =require("mongodb");


export class sala extends connect {
    static instanceSala;
    db;
    collection;
    constructor() {
        if (sala.instanceSala) {
            return sala.instanceSala;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('sala');
        sala.instanceSala = this;
    }
    destructor(){
        sala.instanceSala = undefined;
        connect.instanceConnect = undefined;
    }
    async getAllTest() {
        await this.conexion.connect();
        const res = await this.collection.find({}).toArray(); 
        await this.conexion.close();
        return res;
    }
}