const connect  = require("../helpers/db/connect");
const {ObjectId} =require("mongodb");


export class tarjetaVip extends connect {
    static instanceTarjetaVip;
    db;
    collection;
    constructor() {
        if (tarjetaVip.instanceTarjetaVip) {
            return tarjetaVip.instanceTarjetaVip;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('tarjetaVip');
        tarjetaVip.instanceTarjetaVip = this;
    }
    destructor(){
        tarjetaVip.instanceTarjetaVip = undefined;
        connect.instanceConnect = undefined;
    }
    async getAllTest() {
        await this.conexion.connect();
        const res = await this.collection.find({}).toArray(); 

        return res;
    }
}