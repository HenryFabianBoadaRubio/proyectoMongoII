import { connect } from "../../helpers/db/connect.js";

export class practica extends connect {
    static instancePractica;
    db;
    collection;
    constructor() {
        if (practica.instancePractica) {
            return practica.instancePractica;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('test');
        practica.instancePractica = this;
    }
    destructor(){
        practica.instancePractica = undefined;
        connect.instanceConnect = undefined;
    }
    async getAllTest() {
       
        const res = await this.collection.find({}).toArray(); 
        
        return res;
    }
}