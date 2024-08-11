
document.addEventListener('DOMContentLoaded',() =>{
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
        })
        .catch(error => {
            console.error('Error al obtener las películas:', error);
            document.getElementById('peliculas_contenedor').innerHTML = '<p>No se pudieron cargar las películas.</p>';
        });
        
});



function displayMovies(peliculas) {
    const container = document.getElementById('peliculas_contenedor');
   
    container.innerHTML = ''; 
    peliculas.forEach(pelicula => {
        
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        const imageUrl = pelicula.caratula;
        const movieName = pelicula.titulo;
        const movieGenres = pelicula.genero;
        movieItem.innerHTML =`
            <img src="${imageUrl}" alt="${movieName}" class="movie-image">
            <h3>${movieName}</h3>
            <p>${movieGenres}</p>
        `;
        container.appendChild(movieItem);
    });
}



















//indicadores de movimiento de las peliculas.
const indicators = document.querySelectorAll('.indicator');
const carrusel = document.querySelector('.main__carrusel');
const images = carrusel.querySelectorAll('.carrusel__img');
let currentIndex = 0;

function updateIndicators(index) {
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

carrusel.addEventListener('scroll', () => {
    const scrollPosition = carrusel.scrollLeft;
    const imageWidth = carrusel.clientWidth;
    const newIndex = Math.floor(scrollPosition / (imageWidth / 2));

    if (newIndex !== currentIndex) {
        updateIndicators(newIndex);
        currentIndex = newIndex;
    }
});

// Inicializar el primer indicador como activo
updateIndicators(0);