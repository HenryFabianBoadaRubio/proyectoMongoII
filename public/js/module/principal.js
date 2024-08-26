


document.addEventListener('DOMContentLoaded', () => {

    fetch('/usuario/get_username')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            document.querySelector('.header__texto__bienvenida h4').textContent = `Hi, ${data.userName}!`;
        })
        .catch(error => console.error('Error al cargar el nombre de usuario:', error));


    let allMovies = [];
    
    document.getElementById('search-icon').addEventListener('click', (e) => {
        e.preventDefault(); 
    
        const searchInput = document.getElementById('search-input');
        const container = document.querySelector('.header__buscador');
    
    
        container.classList.add('focused-container');
        searchInput.focus();

    
        setTimeout(() => {
            container.classList.remove('focused-container');
        }, 3000); 
    });
    
    


    fetch('/pelicula/todasPeliculas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(peliculas => {
            allMovies = peliculas;
            displayMovies(allMovies);
            displayMoviesComing(allMovies);
        })
        .catch(error => {
            console.error('Error al obtener las películas:', error);
            document.getElementById('peliculas_contenedor').innerHTML = '<p>No se pudieron cargar las películas.</p>';
        });
        document.getElementById('search-input').addEventListener('input', () => {
            performSearch(allMovies);
        });

});

/*FIN PARTE FUNCIONAL*/
/*FIN PARTE FUNCIONAL*/
/*FIN PARTE FUNCIONAL*/

function performSearch(allMovies) {
    const query = document.getElementById('search-input').value.toLowerCase();
    const mainContent = document.querySelector('.contenedor__global');
    const noResultsMessage = document.querySelector('.no-results-message');
    

    const filteredMovies = allMovies.filter(pelicula => 
        pelicula.titulo.toLowerCase().includes(query) ||
        pelicula.genero.toLowerCase().includes(query)
    );

    const toggleSections = (displayAllMovies, displayAllMoviesComing) => {
        if (displayAllMovies.length === 0 && displayAllMoviesComing.length === 0) {
            mainContent.style.display = 'none';
            noResultsMessage.style.display = 'flex';
            
        } else {
            mainContent.style.display = 'block';
            noResultsMessage.style.display = 'none';
            displayMovies(displayAllMovies);
            displayMoviesComing(displayAllMoviesComing);
            
            updateCenterInfo(filteredMovies[0]);
        }
    };

    toggleSections(filteredMovies, filteredMovies);
}

function displayMovies(peliculas) {
    const container = document.getElementById('peliculas_contenedor');

    container.innerHTML = '';
    peliculas.forEach(pelicula => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('swiper-slide');
        movieItem.dataset.id = pelicula._id;
        movieItem.innerHTML = `
            <div class="contenedor__pelicula__imagen">
                <img src="${pelicula.caratula}" alt="${pelicula.titulo}" class="pelicula__imagen">
            </div>
        `;

        movieItem.addEventListener('click', () => {
            window.location.href = `/views/pelicula.html?peliculaId=${pelicula._id}`;
        });

        container.appendChild(movieItem);
    });
    if (document.querySelector('.swiper-container').swiper) {
        document.querySelector('.swiper-container').swiper.update();
    } else {
        initSwiper(peliculas);
    }
}

function initSwiper(peliculas) {
    new Swiper('.swiper-container', {
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
            window.location.href =`/views/pelicula.html?peliculaId=${pelicula._id}`;
        });
        container.appendChild(movieItem);
    });
}







