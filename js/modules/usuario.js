import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

export class usuario extends connect {
    static instanceUsuario;
    db;
    collection;
    constructor() {
        if (usuario.instanceUsuario) {
            return usuario.instanceUsuario;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('usuario');
        usuario.instanceUsuario = this;
    }
    destructor(){
        usuario.instanceUsuario = undefined;
        connect.instanceConnect = undefined;
    }
    async getAllTest() {
        await this.conexion.connect();
        const res = await this.collection.find({}).toArray(); 
        await this.conexion.close();
        return res;
    }

    async registerUser({nombre,email,rol,nick}){
        try {
            
            //verificar la existencia de usuario por nickname
            let userExist=await this.db.collection('usuario').findOne({nick:nick})
            if (userExist){
                return {
                    error: "Error",
                    message: "El nick ya existe."
                };
            }
           
            //validar que el gmail sea correcto
            let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!regex.test(email)){
                return {
                    error: "Error",
                    message: "El email no es válido."
                };
            }

            const usuario ={
                nombre:nombre,
                email:email,
                rol:rol,
                nick:nick
            }
            const guardaUsuario = await this.db.collection('usuario').insertOne(usuario);
            await this.db.command({
                createUser: nick,
                pwd: guardaUsuario.insertedId.toString(),
                roles: [{role: rol, db: 'cineCampus'}]

            })
            return {
                message: "Usuario registrado correctamente.",
                user_id: guardaUsuario.insertedId
            };
        } catch (error) {
            return { error: "Error", message: error.message,details: error.errInfo};
            
        }
    }
}