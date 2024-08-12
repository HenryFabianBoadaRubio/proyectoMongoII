// const {ObjectId} =require('mongodb');


document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const peliculaId = urlParams.get('peliculaId');
    if (!peliculaId) {
        console.error('No movieId provided in the URL');
        return; 
    }
    fetch(`http://localhost:5001/pelicula/unaPelicula/${peliculaId}`)
        .then(response => response.json())
        .then(data => { 
            console.log('Detalle de la pelicula', data);
            fetch(`http://localhost:5001/pelicula/todasPeliculas`)
            .then(response => response.json())
            .then(allData=>{
                // const projectionMovie = allData.find(movies => movies._id.equals(new ObjectId(peliculaId)));
                const projectionMovie = allData.find(movies => movies._id.toString() === peliculaId);
                if(projectionMovie){
                    console.log('proyecciones encontradas:', projectionMovie.proyecciones);
                    
                }else{
                    console.error('NO se encontraron proyecciones',peliculaId)
                }
            displayMovieDetail(data);
            displayProjectionMovie(projectionMovie);
        })
        .catch(error => console.error('Error al cargar proyecciones de la película:', error));
    })
    .catch(error=> console.error('Error al cargar detalles', error))
    

});

function displayMovieDetail(peliculas) {
    const container = document.getElementById('informacion__pelicula');
    const pelicula = peliculas[0];
    container.innerHTML = `
    <div class="movie_container__detalle">
    <img src="${pelicula.caratula2}" alt="${pelicula.titulo}" class="detallado__pelicula">
        <div class="movie_texts__detalle">
            <h2>${pelicula.titulo}</h2>
            <p><strong>Sinopsis:</strong> ${pelicula.sinopsis}</p>
            <p><strong>Género:</strong> ${pelicula.genero}</p>
            <p><strong>Duración:</strong> ${pelicula.duracion} minutos</p>
            <p><strong>Actores:</strong> ${pelicula.actores}</p>
            
        </div>    
     </div>   
    `;
}
// function displayProjectionMovie(peliculas) {
//     console.log('Objeto pelicula en displayProjectionMovie:', peliculas);
//     const containers = document.getElementById('carrusel__proyecciones');
//     console.log('Pelicula:', peliculas);
//     console.log('Proyecciones:', peliculas.proyecciones);


//     if (peliculas && peliculas.proyecciones) {
//         console.log('Proyecciones:', peliculas.proyecciones);

//     const proyecciones = Array.isArray(peliculas.proyecciones) ? peliculas.proyecciones : [];
//     const proyeccionesHtml = peliculas.proyecciones.map(proyeccion => {
//         /
//         return `<li>Fecha: ${proyeccion.fecha}, Sala: ${proyeccion.sala_id.nombre}</li>`;
//     }).join('');

//     containers.innerHTML = `
//     <div class="movie_container__detalle">
//         <ul>${proyeccionesHtml}</ul>
//     </div>
//     `;
// }}
function displayProjectionMovie(peliculas) {
    console.log('Objeto pelicula en displayProjectionMovie:', peliculas);
    const containers = document.getElementById('carrusel__proyecciones');
    
    if (peliculas && peliculas.proyecciones) {
        console.log('Proyecciones:', peliculas.proyecciones);
        
        
        const proyeccionesHtml = peliculas.proyecciones.map((proyeccion, index) => {
            return `<li class="proyeccion-item -${index}">
                        <span class="proyeccion__fecha">Fecha: ${proyeccion.fecha}</span>,
                        <span class="proyeccion__precio">Precio: ${proyeccion.precio}</span>,
                        <span class="proyeccion__formato">Formato: ${proyeccion.formato}</span>
                    </li>`;
        }).join('');

        containers.innerHTML = `
        <div class="movie__container__proyecciones">
            <ul>${proyeccionesHtml}</ul>
        </div>
        `;
    } else {
        containers.innerHTML = '<p>No hay proyecciones disponibles</p>';
    }
}
