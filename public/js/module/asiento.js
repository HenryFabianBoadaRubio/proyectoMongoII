document.addEventListener('DOMContentLoaded', function() {
    const chooseseat = document.getElementById("back");
    chooseseat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back();
    });

    const selectedMovieID = localStorage.getItem('selectedMovieID');
        let selectNewDate=null;
        let selectNewHour=null;

    if (selectedMovieID) {
        fetch(`/pelicula/proyeccion/${selectedMovieID}`)
            .then(response => response.json())
            .then(data => {
                console.log('Proyecciones:', data);

                // Obtener el contenedor donde colocar las horas y precios
                const hourPriceContainer = document.getElementById('hour__proyection');

                // Limpiar cualquier contenido previo
                hourPriceContainer.innerHTML = '';

                // Iterar sobre las proyecciones
                data.proyecciones.forEach(proyeccion => {
                    const fecha = new Date(proyeccion.fecha);
                    const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                    const precio = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0  }).format(proyeccion.precio);
                    const formato = proyeccion.formato.toUpperCase();

                    // Crear el elemento HTML para esta proyección
                    const hourDiv = document.createElement('div');
                    hourDiv.className = 'hour';
                    hourDiv.onclick = () => selectHour(hourDiv);

                    // Añadir la hora
                    const horaElement = document.createElement('h2');
                    horaElement.textContent = hora;
                    hourDiv.appendChild(horaElement);

                    // Añadir el precio y formato
                    const precioFormatoElement = document.createElement('p');
                    precioFormatoElement.textContent = `${precio} · ${formato}`;
                    hourDiv.appendChild(precioFormatoElement);

                    // Añadir este elemento al contenedor
                    hourPriceContainer.appendChild(hourDiv);
                });
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
