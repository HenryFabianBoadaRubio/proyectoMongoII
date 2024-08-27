// Definimos claves y tiempo de expiración para el caché
const cacheKeyPelicula = 'peliculaDetalle';
const cacheKeyProyecciones = 'proyeccionesDetalle';
const cacheExpiration = 3600000; // 1 hora en milisegundos

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const peliculaId = urlParams.get('peliculaId');
    if (!peliculaId) {
        console.error('No movieId provided in the URL');
        return;
    }

    const currentTime = Date.now();

    // Verificamos si los detalles de la película están en el caché
    const cachedPelicula = localStorage.getItem(`${cacheKeyPelicula}_${peliculaId}`);
    if (cachedPelicula) {
        const { timestamp, data } = JSON.parse(cachedPelicula);
        if (currentTime - timestamp < cacheExpiration) {
           
            displayMovieDetail(data);
            setupBookNowButton(data._id);
        } else {
            fetchMovieDetails(peliculaId);
        }
    } else {
        fetchMovieDetails(peliculaId);
    }

    
});

function fetchMovieDetails(peliculaId) {
    fetch(`/pelicula/unaPelicula/${peliculaId}`)
        .then(response => response.json())
        .then(data => {
            // Asumiendo que data es un array con un solo elemento
            const pelicula = Array.isArray(data) ? data[0] : data;
            
            // Guardar en caché
            localStorage.setItem(`${cacheKeyPelicula}_${peliculaId}`, JSON.stringify({
                timestamp: Date.now(),
                data: pelicula
            }));
            
            displayMovieDetail(pelicula);
            setupBookNowButton(pelicula._id);
        })
        .catch(error => {
            console.error('Error al cargar detalles', error);
            document.getElementById('informacion__pelicula').innerHTML = '<p>Error al cargar los detalles de la película.</p>';
        });
}



function displayMovieDetail(pelicula) {
    const container = document.getElementById('informacion__pelicula');
    
    // Verificar si pelicula es un array y tomar el primer elemento si lo es
    if (Array.isArray(pelicula)) {
        pelicula = pelicula[0];
    }

    // Verificar si pelicula y pelicula.actores existen
    if (!pelicula || !pelicula.actores) {
        console.error('Datos de película inválidos:', pelicula);
        container.innerHTML = '<p>Error al cargar los detalles de la película.</p>';
        return;
    }

    // Crear un string HTML para los actores
    const actoresHTML = Array.isArray(pelicula.actores) ? pelicula.actores.map(actor => `
        <div class="actor__detalle">
            <img src="${actor.foto}" alt="${actor.nombre}" class="actor__foto">
            <div class="actor__texto">
                <p>${actor.nombre}</p>
                <p>${actor.personaje}</p>
            </div>
        </div>
    `).join('') : '';

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

function mostrarTrailer(trailerUrl) {
    const caratulaContainer = document.getElementById('caratula-container');
    if (trailerUrl) {
       
        if (trailerUrl.includes('youtube.com/watch?v=')) {
            
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

const miCine =  document.getElementById("miCine");
const miBoton = document.getElementById("miBoton");

miCine.addEventListener('click', function(){
    miBoton.style.display='block';
    miCine.style.border = '';
    setTimeout(function(){
        miBoton.style.display='none';
        miCine.style.border = 'none';
    },5000);
});

function setupBookNowButton(peliculaId) {
    document.getElementById('miBoton').addEventListener('click', function() {
       
        localStorage.setItem('selectedMovieID', peliculaId);
        window.location.href = './asiento.html';
    });
}


