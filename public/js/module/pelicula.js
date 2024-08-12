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
            displayMovieDetail(data);
        })
        .catch(error => console.error('Error al cargar detalles de la película:', error));
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
