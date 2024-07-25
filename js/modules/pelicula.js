import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

export class pelicula extends connect {
    static instancePelicula;
    db;
    collection;
    constructor() {
        if (pelicula.instancePelicula) {
            return pelicula.instancePelicula;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('pelicula');
        pelicula.instancePelicula = this;
    }
    destructor(){
        pelicula.instancePelicula = undefined;
        connect.instanceConnect = undefined;
    }
    async getAllTest() {
        await this.conexion.connect();
        const res = await this.collection.find({}).toArray(); 
        await this.conexion.close();
        return res;
    }

/**
 * Obtiene todas las películas con sus proyecciones y información relacionada de la sala.
 *
 * @returns {Promise<Array>} Una promesa que se resuelve a un array de objetos de películas con sus proyecciones y
 * información de la sala.
 *
 * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la ejecución
 * de la operación de agregación.
 */
    async getAllMoviesProjection(){
        try {
            await this.conexion.connect();
            let res = await this.collection.aggregate([
                {
                  $lookup: {
                    from: "proyeccion",
                    localField: "_id",
                    foreignField: "pelicula_id",
                    as: "proyecciones"
                  }
                },
                {
                  $unwind: "$proyecciones"
                },
                {
                  $lookup: {
                    from: "sala",
                    localField: "proyecciones.sala_id",
                    foreignField:"_id",
                    as: "proyecciones.sala_id"
                  }
                },
                {
                  $unwind: "$proyecciones.sala_id"
                },
                {
                  $group: {
                    _id:"$_id",
                    titulo:{$first:"$titulo"},
                    genero:{$first:"$genero"},
                    duracion:{$first:"$duracion"},
                    proyecciones:{$push:"$proyecciones"},
                    
                  }
                }
              
              ]).toArray();
              return res;
        } catch (error) {
            return { error: "Error", message: error.message,details: error.errInfo};
        }finally{
            await this.conexion.close();
        }
    }

        /**
     * Obtiene la información detallada de una película específica.
     *
     * @param {ObjectId} id - El identificador único de la película.
     *
     * @returns {Promise<Array>} Una promesa que se resuelve a un array de objetos de películas con información detallada.
     * El array contendrá un solo objeto si la película existe, o un array vacío si no se encuentra.
     *
     * @throws {Error} Lanza un error si hay algún problema durante la conexión a la base de datos o durante la ejecución
     * de la operación de agregación.
     */

    async getAllMovieInformation(id){
        try {
            await this.conexion.connect();

            //verificar laexistencia de la pelicula
            let peliExist=await this.db.collection('pelicula').findOne({_id: new ObjectId(id)})
            if(!peliExist){
                return{
                    error: "Not found",
                    message: "La pelicula no existe."
                }
            
            }

            let res= await this.collection.aggregate(
                [
                    {
                      $match: {
                        _id:id
                      }
                    },
                    {
                      $project: {
                        titulo:1,
                        genero:1,
                        duracion:1,
                        actores:1,
                        sinopsis:1
                      }
                    }
                  ]
            ).toArray();
            return res;
        } catch (error) {
            return { error: "Error", message: error.message,details: error.errInfo};
            
        }finally{
            await this.conexion.close();
        }
    }
}
