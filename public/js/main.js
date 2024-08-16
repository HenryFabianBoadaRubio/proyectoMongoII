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

/*FIN PARTE FUNCIONAL*/
/*FIN PARTE FUNCIONAL*/
/*FIN PARTE FUNCIONAL*/

function displayMovies(peliculas) {
    const container = document.getElementById('peliculas_contenedor');

    container.innerHTML = '';
    peliculas.forEach((pelicula, index) => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('swiper-slide');
        movieItem.dataset.id = pelicula._id;
        movieItem.innerHTML = `
            <div class="contenedor__pelicula__imagen">
                <img src="${pelicula.caratula}" alt="${pelicula.titulo}" class="pelicula__imagen">
            </div>
        `;

        movieItem.addEventListener('click', () => {
            window.location.href = `./views/pelicula.html?peliculaId=${pelicula._id}`;
        });

        container.appendChild(movieItem);
    });

    initSwiper(peliculas);
}

function initSwiper(peliculas) {
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 2    ,
        centeredSlides: true,
        spaceBetween: 100,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        on: {
            slideChange: function () {
                updateCenterInfo(peliculas[this.activeIndex]);
            },
        },
    });

    updateCenterInfo(peliculas[0]);
}

function updateCenterInfo(pelicula) {
    const titleElement = document.querySelector('.movie-info-center .movie-title');
    const genreElement = document.querySelector('.movie-info-center .movie-genre');
    
    titleElement.textContent = pelicula.titulo;
    genreElement.textContent = pelicula.genero;
}
/*FIN PARTE FUNCIONAL*/
/*FIN PARTE FUNCIONAL*/
/*FIN PARTE FUNCIONAL*/

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







