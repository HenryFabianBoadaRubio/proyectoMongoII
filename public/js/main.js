document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5001/pelicula/todasPeliculas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(peliculas => {
            console.log('Películas obtenidas:', peliculas);
            displayMovies(peliculas);
            displayMoviesComing(peliculas);
        })
        .catch(error => {
            console.error('Error al obtener las películas:', error);
            document.getElementById('peliculas_contenedor').innerHTML = '<p>No se pudieron cargar las películas.</p>';
        });

});

function displayMovies(peliculas) {
    const container = document.getElementById('peliculas_contenedor');

    container.innerHTML = '';
    peliculas.forEach((pelicula, index) => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.dataset.id = pelicula._id;
        movieItem.innerHTML = `
            <div class="contenedor__pelicula__imagen">
                <img src="${pelicula.caratula}" alt="${pelicula.titulo}" class="pelicula__imagen">
             </div>
            <div class="nombre__genero__principal">
                <h3 class="pelicula__titulo">${pelicula.titulo}</h3>
                <p class="pelicula__generos">${pelicula.genero}</p>
            </div>
        `;

        movieItem.addEventListener('click', () => {
            window.location.href = `./views/pelicula.html?peliculaId=${pelicula._id}`;
        });

        container.appendChild(movieItem);
    });

    
}

function displayMoviesComing(peliculas) {
    const container = document.getElementById('peliculas_contenedor__coming');
   
    container.innerHTML = ''; 
    peliculas.forEach(pelicula => {
        
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.dataset.id= pelicula._id;
        const imageUrl = pelicula.caratula;
        const movieName = pelicula.titulo;
        const movieGenres = pelicula.genero;
        movieItem.innerHTML = `
        <div class="movie_container">
            <img src="${imageUrl}" alt="${movieName}" class="movie_image_coming">
            <div class="movie_texts">
                <h3>${movieName}</h3>
                <p>${movieGenres}</p>
            </div>
        </div>
         `;
         movieItem.addEventListener('click', () => {
            window.location.href =`./views/pelicula.html?peliculaId=${pelicula._id}`;
        });
        container.appendChild(movieItem);
    });
}







