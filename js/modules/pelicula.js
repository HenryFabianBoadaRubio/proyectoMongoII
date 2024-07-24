import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

export class pelicula extends connect {
    static instancePelicula;
    db;
    collection;
    constructor() {
        if (pelicula.instancePelicula) {
            return pelicula.instancePelicula;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('pelicula');
        pelicula.instancePelicula = this;
    }
    destructor(){
        pelicula.instancePelicula = undefined;
        connect.instanceConnect = undefined;
    }
    async getAllTest() {
        await this.conexion.connect();
        const res = await this.collection.find({}).toArray(); 
        await this.conexion.close();
        return res;
    }
}