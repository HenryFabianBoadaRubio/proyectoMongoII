









document.addEventListener('DOMContentLoaded', function() {
    const chooseseat = document.getElementById("back");
    chooseseat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back();
    });
    console.log(localStorage.getItem('selectedMovieID'));
    const selectedMovieID = localStorage.getItem('selectedMovieID');
    
    if (selectedMovieID) {
        fetch(`/pelicula/proyeccion/${selectedMovieID}`)

            .then(response => response.json())
            .then(data => {
                console.log('Proyecciones:', data);
                // Aquí puedes manejar la información de las proyecciones para mostrarlas en la interfaz
            })
            .catch(error => console.error('Error al obtener proyecciones:', error));
    }

    const daysContainer = document.getElementById('days-container');
    const today = new Date();

    const getDayName = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.dataset.date = date.toISOString().split('T')[0];

        const dayName = document.createElement('p');
        dayName.textContent = getDayName(date);
        const dayNumber = document.createElement('h2');
        dayNumber.textContent = date.getDate();

        dayDiv.appendChild(dayName);
        dayDiv.appendChild(dayNumber);

        daysContainer.appendChild(dayDiv);
    }
});