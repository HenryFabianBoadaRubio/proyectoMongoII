document.addEventListener('DOMContentLoaded', () => {
    let displayedMovieIds = [];
  
    
   


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
    const cacheKey = 'peliculas';  
    const cacheExpiration = 3600000; 
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
    

    function fetchAndDisplayMovies() {
        fetch('/pelicula/todasPeliculas')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red');
                }
                return response.json();
            })
            .then(peliculas => {
                allMovies = peliculas;
                // Guardar en caché
                
                
                localStorage.setItem(cacheKey, JSON.stringify({
                    timestamp: Date.now(),
                    data: JSON.stringify(peliculas)
                }));
                displayMovies(allMovies);
                displayMoviesComing(allMovies);
            })
            .catch(error => {
                console.error('Error al obtener las películas:', error);
                document.getElementById('peliculas_contenedor').innerHTML = '<p>No se pudieron cargar las películas.</p>';
            });
    }

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        const currentTime = Date.now();
        if (currentTime - timestamp < cacheExpiration) {
            console.log('Datos de películas obtenidos del caché');
            allMovies = JSON.parse(data);
            displayMovies(allMovies);
            displayMoviesComing(allMovies);
        } else {
            // Caché expirado, obtener nuevos datos
            fetchAndDisplayMovies();
        }
    } else {
        // No hay caché, obtener nuevos datos
        fetchAndDisplayMovies();
    }

    document.getElementById('search-input').addEventListener('input', () => {
        performSearch(allMovies);
    });

});


function performSearch(allMovies) {
    const query = document.getElementById('search-input').value.toLowerCase();
    const mainContent = document.querySelector('.contenedor__global');
    const noResultsMessage = document.querySelector('.no-results-message');

    const filteredMovies = allMovies.filter(pelicula => 
        pelicula.titulo.toLowerCase().includes(query) ||
        pelicula.genero.toLowerCase().includes(query)
    );

    const displayedMovies = filteredMovies.filter(pelicula => new Date(pelicula.fecha_estreno) <= new Date());
    const upcomingMovies = filteredMovies.filter(pelicula => new Date(pelicula.fecha_estreno) > new Date());

    const toggleSections = (displayAllMovies, displayAllMoviesComing) => {
        if (displayAllMovies.length === 0 && displayAllMoviesComing.length === 0) {
            mainContent.style.display = 'none';
            noResultsMessage.style.display = 'flex';
        } else {
            mainContent.style.display = 'block';
            noResultsMessage.style.display = 'none';
            displayMovies(displayAllMovies);
            displayMoviesComing(displayAllMoviesComing);
            
            updateCenterInfo(displayAllMovies[0]);
        }
    };

    toggleSections(displayedMovies, upcomingMovies);
}


function displayMovies(peliculas) {
    const container = document.getElementById('peliculas_contenedor');
    container.innerHTML = '';
    const fechaActual = new Date();
    displayedMovieIds = []; // Reiniciar la lista de IDs mostrados

    peliculas.forEach(pelicula => {
        const fechaEstreno = new Date(pelicula.fecha_estreno);
        
        if (fechaEstreno <= fechaActual) {
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

            // Agregar el ID de la película a la lista de mostradas
            displayedMovieIds.push(pelicula._id);
        }
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

function displayMoviesComing(peliculas) {
    const container = document.getElementById('peliculas_contenedor__coming');
    container.innerHTML = ''; 
    const fechaActual = new Date();

   

    // Filtrar primero las películas con fecha de estreno futura
    const peliculasFuturas = peliculas.filter(pelicula => {
        const fechaEstreno = new Date(pelicula.fecha_estreno);
    
        return fechaEstreno > fechaActual;
    });

  

    peliculasFuturas.forEach(pelicula => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.dataset.id = pelicula._id;
        const imageUrl = pelicula.caratula;
        const movieName = pelicula.titulo;
        const movieGenres = pelicula.genero;
        const fechaEstreno = new Date(pelicula.fecha_estreno);
        movieItem.innerHTML = `
        <div class="movie_container">
            <img src="${imageUrl}" alt="${movieName}" class="movie_image_coming">
            <div class="movie_texts">
                <h3>${movieName}</h3>
                <p>${movieGenres}</p>
                <p><strong>${fechaEstreno.getFullYear()}</strong></p>
            </div>
        </div>
        `;
        movieItem.addEventListener('click', () => {
            window.location.href = `/views/pelicula.html?peliculaId=${pelicula._id}`;
        });
        container.appendChild(movieItem);
    });

    if (peliculasFuturas.length === 0) {
        container.innerHTML = '<p>No hay películas próximas a estrenar.</p>';
    }
}






