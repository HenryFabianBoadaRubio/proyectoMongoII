const {ObjectId} =require("mongodb");
const express = require("express");
const Usuario = require("../modules/usuario");
const appUsuario = express.Router();


    appUsuario.post("/crearUsuario", async(req, res, next )=>{
        let obj = new Usuario();
        try {
            const {nombre,email,rol,nick}= req.body
            const usuario = await obj.registerUser({nombre,email,rol,nick});
            res.status(200).send(usuario);
        } catch (error) {
            next(error);
        }
        finally{
            obj.destructor();
        }
    })



    appUsuario.get("/detallesUsuario/:_id", async(req, res, next)=>{
        let obj = new Usuario();
        try {
            const usuario= await obj.getDetailsUser({_id:req.params._id});
            res.status(200).send(usuario)
        } catch (error) {
            next(error);
        }
        finally{
            obj.destructor();
        }
    })



    appUsuario.put("/actualizarUsuario", async(req, res, next)=>{
        let obj = new Usuario();
        try {
            const {_id,rol}= req.body
            const usuario = await obj.updateUser({_id: _id,rol:rol});
            res.status(200).send(usuario)
        } catch (error) {
            next(error);
        }
        finally{
            obj.destructor();
        }
    })

    appUsuario.get("/obtenerUsuarios", async(req, res, next)=>{
        let obj = new Usuario();
        try {
            let usuarios= await obj.getAllUsersMongo();
            if (req.query.rol) usuarios = usuarios.filter(user => user.rol === req.query.rol);
            res.status(200).send(usuarios)
        } catch (error) {
            next(error);
        }
        finally{
            obj.destructor();
        }
    })
    
    appUsuario.get("/userenv", async (req, res, next) => {
        let obj = new Usuario();
        try {
            let userId = await obj.getUserIdFromEnv();
            
            if (userId.error) {
                // Si hay un error, enviar una respuesta de error
                return res.status(400).json(userId);
            }
    
            // Si la operación fue exitosa, enviar el ID del usuario
            res.status(200).json({ userId: userId.toString() });
        } catch (error) {
            next(error);
        } finally {
            obj.destructor();
        }
    });

    appUsuario.get('/get_username', (req, res) => {
        const userName = process.env.MONGO_USER; 
        res.json({ userName });
    });
module.exports= appUsuario