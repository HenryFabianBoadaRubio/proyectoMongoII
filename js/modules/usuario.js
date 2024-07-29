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
        /**
     * Registra un nuevo usuario en la base de datos.
     *
     * @param {Object} usuario - El objeto de usuario que contiene la información del usuario.
     * @param {string} usuario.nombre - El nombre del usuario.
     * @param {string} usuario.email - El correo electrónico del usuario.
     * @param {string} usuario.rol - El rol del usuario.
     * @param {string} usuario.nick - El nombre de usuario (nick).
     *
     * @returns {Object} - Objeto con el resultado del registro.
     * @returns {Object.error} - Si hay un error, este campo contendrá el string "Error".
     * @returns {Object.message} - Mensaje de éxito o error.
     * @returns {Object.user_id} - ID del usuario registrado (en caso de éxito).
     * @returns {Object.details} - Detalles adicionales del error (en caso de error).
     */
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