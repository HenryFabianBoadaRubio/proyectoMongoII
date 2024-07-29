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

            //validar que el gmail no exista ya en la base de datos
            let userExistEmail=await this.db.collection('usuario').findOne({email:email})
            if (userExistEmail){
                return {
                    error: "Error",
                    message: "El email ya existe."
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

        /**
     * Obtiene los detalles detallados del usuario de la base de datos.
     *
     * @param {string} _id - El identificador único del usuario.
     *
     * @returns {Promise} - Una promesa que se resuelve a los detalles del usuario o un objeto de error.
     * @returns {Object} - Los detalles del usuario si la operación es exitosa.
     * @returns {Object.error} - Si hay un error, este campo contendrá el string "Error".
     * @returns {Object.message} - Mensaje de éxito o error.
     * @returns {Object.details} - Detalles adicionales del error (en caso de error).
     * @returns {Object.nombre} - Nombre del usuario.
     * @returns {Object.email} - Correo electrónico del usuario.
     * @returns {Object.rol} - Rol del usuario.
     * @returns {Object.nick} - Nombre de usuario (nick).
     * @returns {Object.estado} - Estado de la tarjeta VIP del usuario (si existe).
     * @returns {Object.num_Tarjeta} - Número de tarjeta VIP del usuario (si existe).
     */
    async getDetailsUser(_id){
        try {
            await this.conexion.connect();

            //Verificar la existencia del usuario por id
            let userExist=await this.db.collection('usuario').findOne({_id:new ObjectId(_id)})
            if (!userExist){
                return {
                    error: "Error",
                    message: "El usuario no existe."
                };
            }
            
            let res= await this.collection.aggregate([
                    {
                  $match: {
                     _id: new ObjectId(_id) 
                  }
                },
                {
                  $lookup: {
                    from: "tarjetaVIP",
                    localField: "_id",
                    foreignField: "usuario_id",
                    as: "usuarios"
                  }
                  
                },
                {
                  $unwind: "$usuarios"
                },
                {
                  $project: {
                    nombre:1,
                    email:1,
                    rol:1,
                    nick:1,
                    estado:"$usuarios.estado",
                    num_Tarjeta:"$usuarios.numero_tarjeta"
                    
                  }
                }
            ]).toArray();
            return res;
              
            

        } catch (error) {
            return { error: "Error", message: error.message,details: error.errInfo};
            
        }

    }

    async updateUser(_id, { nombre, email, rol, nick }) {
        try {
            
            const collection = this.db.collection('usuario');
            // Verificar existencia del usuario por nickname (para asegurarse de que el nuevo nick no esté en uso)
            let userExist = await collection.findOne({ nick: nick, _id: { $ne: new ObjectId(_id) } });
            if (userExist) {
                return {
                    error: "Error",
                    message: "El nick ya existe."
                };
            }
    
            // Validar que el email sea correcto
            let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(email)) {
                return {
                    error: "Error",
                    message: "El email no es válido."
                };
            }
    
            // Validar que el email no exista ya en la base de datos (para asegurarse de que el nuevo email no esté en uso)
            let userExistEmail = await collection.findOne({ email: email, _id: { $ne: new ObjectId(_id) } });
            if (userExistEmail) {
                return {
                    error: "Error",
                    message: "El email ya existe."
                };
            }
    
            // Actualizar el usuario en la colección
            await collection.updateOne(
                { _id: new ObjectId(_id) },
                { $set: { nombre: nombre, email: email, rol: rol, nick: nick } }
            );
    
            // Eliminar el usuario en la base de datos de MongoDB (para permisos)
            await this.db.removeUser(nick);
    
            // Crear el nuevo usuario en la base de datos de MongoDB con los permisos actualizados
            await this.db.command({
                createUser: nick,
                pwd: new ObjectId().toString(),  // Genera una nueva contraseña segura
                roles: [{ role: rol, db: 'cineCampus' }]
            });
    
            return {
                message: "Usuario actualizado y permisos actualizados correctamente.",
                user_id: _id
            };
        } catch (error) {
            return { error: "Error", message: error.message, details: error.errInfo };
        }
    }
}