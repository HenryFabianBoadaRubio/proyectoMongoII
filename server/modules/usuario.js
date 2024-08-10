const connect  = require("../helpers/db/connect");
const {ObjectId} =require("mongodb");


module.exports=class usuario extends connect {
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
       
            if(rol != "estandar" && rol !="vip" && rol != "administrador"){
                const error = new Error("rol no valido")
                error.status = 400
                throw error
            }

            
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
            
            if (rol == "administrador") {
                await this.db.command({
                    createUser: nick,
                    pwd: guardaUsuario.insertedId.toString(),
                    roles: [{role: "dbOwner", db: 'cineCampus'}]
    
                })
            } else {
                await this.db.command({
                    createUser: nick,
                    pwd: guardaUsuario.insertedId.toString(),
                    roles: [{role: rol, db: 'cineCampus'}]
    
                })
            }

            return {
                message: "Usuario registrado correctamente.",
                user_id: guardaUsuario.insertedId
            };
        
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
    async getDetailsUser({_id}){
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
                $project: {
                  nombre:1,
                  email:1,
                  rol:1,
                  nick:1,
                  estado: {$arrayElemAt: ["$usuarios.estado", 0]},
                  num_Tarjeta: {$arrayElemAt: ["$usuarios.numero_tarjeta", 0]}
                  
                }
              }
          ]).toArray();
            return res;
              
            

        } catch (error) {
            return { error: "Error", message: error.message,details: error.errInfo};
            
        }

    }
        /**
     * Actualiza un usuario en la base de datos y actualiza sus permisos.
     *
     * @param {string} _id - El identificador único del usuario a actualizar.
     * @param {Object} user - Los nuevos valores para el usuario.
     * @param {string} user.nombre - El nuevo nombre del usuario.
     * @param {string} user.email - El nuevo correo electrónico del usuario.
     * @param {string} user.rol - El nuevo rol del usuario.
     * @param {string} user.nick - El nuevo nombre de usuario (nick).
     *
     * @returns {Promise} - Una promesa que se resuelve a un objeto con el resultado de la operación o un objeto de error.
     * @returns {Object} - El resultado de la operación si es exitosa.
     * @returns {Object.error} - Si hay un error, este campo contendrá el string "Error".
     * @returns {Object.message} - Mensaje de éxito o error.
     * @returns {Object.details} - Detalles adicionales del error (en caso de error).
     * @returns {Object.user_id} - ID del usuario actualizado (en caso de éxito).
     */
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

    /**
     * Obtiene todos los usuarios de la colección MongoDB según el rol especificado.
     * Si no se proporciona ningún rol, obtiene todos los usuarios de la colección.
     *
     * @param {string} [rol] - El rol de los usuarios a recuperar.
     * @returns {Promise} - Una promesa que se resuelve a un array de usuarios o un objeto de error.
     * @throws {Error} - Si no se encuentran usuarios con el rol especificado o si no se encuentran usuarios en la colección.
     */
    async getAllUsersMongo(rol){
        try {
            let res;
            //obtener todos los usuarios de un rol especifico que se pase como parametro.
            if(rol){
                res = await this.db.collection('usuario').find({rol:rol}).toArray();
                if (res.length === 0) {
                    throw new Error(`No se encontraron usuarios con el rol: ${rol}`);
                }
    
            }else{
                res = await this.db.collection('usuario').find().toArray();
                if (res.length === 0) {
                    throw new Error('No se encontraron usuarios en la colección');
                }
            }
            return res;

            
        } catch (error) {
            return { error: "Error", message: error.message, details: error.errInfo };
            
        }
    }
}