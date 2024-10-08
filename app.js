const express = require("express");
const cors= require("cors");
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

const mongoose = require('mongoose');
// const path= require("path")
const app = express();
app.use(express.static(process.env.EXPRESS_STATIC))
app.use(cors());
const pelicula = require("./server/modules/pelicula");
const appPelicula= require("./server/routes/pelicula.routes");
const appBoleto = require("./server/routes/boleto.routes");
const appUsuario = require("./server/routes/usuario.routes");
const appAsiento = require("./server/routes/asiento.routes");
app.use(express.json());

app.use(express.static(__dirname));

app.get("/", async(req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/index.html`, {root: __dirname})
})
// //peliculas
app.get("/pelicula", async(req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/pelicula.html`, {root: __dirname})
})
app.use("/pelicula", appPelicula)



// //boletos 
app.get("/boleto", async(req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/boleto.html`, {root: __dirname})
})
app.use("/boleto", appBoleto)


// // asiento
app.get("/asiento", async(req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/asiento.html`, {root: __dirname})
})
app.use("/asiento", appAsiento)



// //usuarios
app.use("/usuario", appUsuario)




app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Error interno del servidor',
    });
});


 async function getUserIdFromEnv(userCollection) {
     try {
         const userIdentifier = process.env.MONGO_USER;
 
         if (!userIdentifier) {
             throw new Error('La variable de entorno MONGO_USER no está definida');
         }
 
       
 
         const user = await userCollection.findOne({ nick: userIdentifier });
 
         if (!user) {
             throw new Error(`No se encontró un usuario con el identificador: ${userIdentifier}`);
         }
 
         return user._id;
 
     } catch (error) {
         console.error('Error en getUserIdFromEnv:', error);
         return { error: "Error", message: error.message, details: error.errInfo };
     }
 }
 
 // Ruta de login
 app.post('/login', async (req, res) => {
     const { username, password } = req.body;
   
     const mongoUrl = `mongodb://${username}:${encodeURIComponent(password)}@${process.env.MONGO_CLUSTER}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
     console.log(`Intentando conectar a: ${mongoUrl.replace(/:([^:@]{1,})@/, ':****@')}`);
     let client;
 
     try {
         // Conectar a la base de datos
         client = new MongoClient(mongoUrl);
         await client.connect();
     
 
         // Obtener la base de datos y la colección
         const db = client.db(process.env.MONGO_DB);
         const userCollection = db.collection('usuario');
 
         // Buscar al usuario con las credenciales proporcionadas
         const user = await userCollection.findOne({ nick: username });
 
         if (user) {
           
 
             // Actualizar las variables de entorno con las nuevas credenciales
             process.env.MONGO_USER = username;
             process.env.MONGO_PWD = password;
 
             // Llamar al método getUserIdFromEnv después de actualizar las variables de entorno
             const userIdFromEnv = await getUserIdFromEnv(userCollection);
 
             if (userIdFromEnv.error) {
                 return res.status(500).json({
                     success: false,
                     message: 'Error al obtener el ObjectId del usuario desde la variable de entorno',
                     details: userIdFromEnv
                 });
             }
 
             // Responder al cliente con éxito
             res.json({
                 success: true,
                 message: 'Login exitoso',
                 userId: user._id.toString(), // Convertir ObjectId a string
                 userIdFromEnv: userIdFromEnv.toString() // Convertir ObjectId a string
             });
         } else {
             // Usuario no encontrado
             res.status(401).json({ success: false, message: 'Credenciales inválidas' });
         }
     } catch (error) {
         console.error('Error en el login:', error);
         res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
     } finally {
         if (client) {
             await client.close();
         }
     }
 });
 

 const config = {
    port: process.env.EXPRESS_PORT || 5001,
    host: process.env.EXPRESS_HOST || '0.0.0.0',
    static: process.env.EXPRESS_STATIC || 'public'  
};


app.listen(config.port,'0.0.0.0', () => {
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
})

