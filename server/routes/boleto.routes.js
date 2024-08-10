const express = require("express");
const boleto= require("../modules/boleto");;
const appBoleto = express.Router();



appBoleto.post("/nuevoBoleto", async(req, res,next)=>{
    try {
        let obj= new boleto();
        const boletos= await obj.registerBuyTicket(req.body)
        res.status(200).send(boletos)
    } catch (error) {
        next(error);

        
    }
})

//66a12e9b1219e115c8e79e99 parametro para verificar.
appBoleto.get("/asientosDisponible/:proyeccion_id", async(req, res, next)=>{
    try {
        let obj= new boleto();
        const asientos= await obj.getAvailableSeats({proyeccion_id: req.params.proyeccion_id})
        res.status(200).send(asientos)
    } catch (error) {
        next(error);
    }
})


appBoleto.post("/reservarAsientos", async(req, res, next)=>{
    try {
        let obj= new boleto();
        const reserva= await obj.reserveSeats(req.body)
        res.status(200).send(reserva)
    } catch (error) {
        next(error);
    }
})

 
appBoleto.put("/cancelarAsientos/:boleto_id", async(req, res, next)=>{
    try {
        let obj= new boleto();
        const cancelacion= await obj.cancelReservation({_id:req.params.boleto_id})
        res.status(200).send(cancelacion)
    } catch (error) {
        next(error);
    }
})



module.exports= appBoleto
