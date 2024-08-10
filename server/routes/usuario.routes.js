const {ObjectId} =require("mongodb");
const express = require("express");
const Usuario = require("../modules/usuario");
const appUsuario = express.Router();


appUsuario.post("/crearUsuario", async(req, res, next )=>{
    try {
        let obj = new Usuario();
        const {nombre,email,rol,nick}= req.body
        const usuario = await obj.registerUser({nombre,email,rol,nick});
        res.status(200).send(usuario);
    } catch (error) {
        next(error);
    }
})



appUsuario.get("/detallesUsuario/:_id", async(req, res, next)=>{
    try {
        let obj = new Usuario();
        const usuario= await obj.getDetailsUser({_id:req.params._id});
        res.status(200).send(usuario)
    } catch (error) {
        next(error);
    }
})

module.exports= appUsuario