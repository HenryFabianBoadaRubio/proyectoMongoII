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
module.exports= appBoleto
