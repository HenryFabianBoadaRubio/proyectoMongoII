const express = require("express");
const asiento= require("../modules/asiento");
const appAsiento = express.Router();

appAsiento.get("/asientosParaSala/:proyeccion_id", async(req, res, next)=>{
    let obj= new asiento();
    try {
        const asientos= await obj.getAvailableSeats({proyeccion_id: req.params.proyeccion_id})
        res.status(200).send(asientos)
    } catch (error) {
        next(error);
    }
    finally{
        obj.destructor();
    }
})

module.exports= appAsiento