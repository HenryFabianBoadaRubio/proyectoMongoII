// const {ObjectId} =require('mongodb');



document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const peliculaId = urlParams.get('peliculaId');
    if (!peliculaId) {
        console.error('No movieId provided in the URL');
        return; 
    }
    fetch(`/pelicula/unaPelicula/${peliculaId}`)
        .then(response => response.json())
        .then(data => { 

            displayMovieDetail(data);
        })
        .catch(error => console.error('Error al cargar detalles', error));
});

function displayMovieDetail(peliculas) {
    const container = document.getElementById('informacion__pelicula');
    const pelicula = peliculas[0];
    // Crear un string HTML para los actores
    const actoresHTML = pelicula.actores.map(actor => `
        <div class="actor__detalle">
            <img src="${actor.foto}" alt="${actor.nombre}" class="actor__foto">
            <div class="actor__texto">
                <p>${actor.nombre}</p>
                <p> ${actor.personaje}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
    <div class="movie_container__detalle">
        <div id="caratula-container">
            <img src="${pelicula.caratula2}" alt="${pelicula.titulo}" class="detallado__pelicula">
         </div>
        <div class="movie_texts__detalle">
            <h2>${pelicula.titulo}</h2>
            <p>${pelicula.genero}</p>
            <h3>${pelicula.sinopsis}</h3>
            <button id="watch-trailer">
                <i class='bx bxs-right-arrow'></i>
                <h2>Watch Trailer</h2>
            </button>
        </div>    
        <div class="titulo__cast">
            <h2>Cast</h2>
        </div> 
        <div class="container__actores"> 
            ${actoresHTML}
        </div>
    </div>   
    `;

    document.getElementById('watch-trailer').addEventListener('click', function() {
        mostrarTrailer(pelicula.trailer);
    });
}
//mostrar trailer en videos.
function mostrarTrailer(trailerUrl) {
    const caratulaContainer = document.getElementById('caratula-container');
    if (trailerUrl) {
        // Verifica si la URL del tráiler es de YouTube y ajusta el formato si es necesario
        if (trailerUrl.includes('youtube.com/watch?v=')) {
            // Convierte la URL de YouTube al formato de embed y usa youtube-nocookie.com
            trailerUrl = trailerUrl.replace('youtube.com/watch?v=', 'youtube-nocookie.com/embed/');
        }
        caratulaContainer.innerHTML = `
            <iframe width="100%" height="100%" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>
        `;
    } else {
        console.error('URL del tráiler no disponible');
        caratulaContainer.innerHTML = `
            <p>Lo sentimos, el tráiler no está disponible en este momento.</p>
        `;
    }
}

//boton compra
 const miCine =  document.getElementById("miCine");
 const miBoton = document.getElementById("miBoton");

 miCine.addEventListener('click', function(){
    miBoton.style.display='block';

    setTimeout(function(){
        miBoton.style.display='none';

    },5000);
 })







// function displayProjectionMovie(peliculas) {
//     console.log('Objeto pelicula en displayProjectionMovie:', peliculas);
//     const containers = document.getElementById('carrusel__proyecciones');
    
//     if (peliculas && peliculas.proyecciones) {
//         console.log('Proyecciones:', peliculas.proyecciones);
        
        
//         const proyeccionesHtml = peliculas.proyecciones.map((proyeccion, index) => {
//             return `<li class="proyeccion-item -${index}">
//                         <span class="proyeccion__fecha">Fecha: ${proyeccion.fecha}</span>,
//                         <span class="proyeccion__precio">Precio: ${proyeccion.precio}</span>,
//                         <span class="proyeccion__formato">Formato: ${proyeccion.formato}</span>
//                     </li>`;
//         }).join('');

//         containers.innerHTML = `
//         <div class="movie__container__proyecciones">
//             <ul>${proyeccionesHtml}</ul>
//         </div>
//         `;
//     } else {
//         containers.innerHTML = '<p>No hay proyecciones disponibles</p>';
//     }
// }
