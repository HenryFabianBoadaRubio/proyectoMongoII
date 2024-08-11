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