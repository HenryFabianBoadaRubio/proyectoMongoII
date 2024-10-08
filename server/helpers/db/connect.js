
const {MongoClient}= require("mongodb");



module.exports= class connect {
    static instanceConnect;
    db;
    user;
    port;
    cluster;
    #url;
    #host;
    #pass; 
    #dbName;

    //mongodb://mongo:IwcZMInZpiWQFGCIHilYIjdEurpFUfuX@viaduct.proxy.rlwy.net:56173
    constructor() {
        if (connect.instanceConnect) {
            return connect.instanceConnect;
        }
        this.setHost = process.env.MONGO_HOST;
        this.user = process.env.MONGO_USER;
        this.setPass = process.env.MONGO_PWD;
        this.port = process.env.MONGO_PORT;
        this.cluster = process.env.MONGO_CLUSTER;
        this.setDbName = process.env.MONGO_DB;
        this.#open();
        connect.instanceConnect = this;
    }

    set setHost(host) {
        this.#host = host;
    }

    set setPass(pass) {
        this.#pass = pass;
    }

    set setDbName(dbName) {
        this.#dbName = dbName;
    }

    get getDbName() {   
        return this.#dbName;
    }
    async reConnect() {
        await this.#open();
    }
    async #open() {

        if (this.user == "root") {
            this.#url = `${this.#host}${this.user}:${this.#pass}@${this.cluster}:${this.port}`;
        } else {
            this.#url = `${this.#host}${this.user}:${this.#pass}@${this.cluster}:${this.port}/${this.getDbName}`;
        }
        this.conexion = new MongoClient(this.#url);
        await this.conexion.connect();
        // console.log("Conexion realizada correctamente");
    }
}