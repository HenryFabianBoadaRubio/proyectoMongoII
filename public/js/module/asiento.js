document.addEventListener('DOMContentLoaded', function() {
    const chooseseat = document.getElementById("back");
    chooseseat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back();
    });

    const selectedMovieID = localStorage.getItem('selectedMovieID');
    let selectNewDate = null;
    let selectNewHour = null;
    let projectionsData = [];

    if (selectedMovieID) {
        fetch(`/pelicula/proyeccion/${selectedMovieID}`)
            .then(response => response.json())
            .then(data => {
                console.log('Proyecciones:', data);
                projectionsData = data.proyecciones; // Guardar las proyecciones para utilizarlas luego
            })
            .catch(error => console.error('Error al obtener proyecciones:', error));
    }

    const daysContainer = document.getElementById('days-container');
    const hourPriceContainer = document.getElementById('hour__proyection');
    const today = new Date();

    const getDayName = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };

    const selectDay = (dayDiv) => {
        document.querySelectorAll('.days .day').forEach(day => {
            day.classList.remove('selected');
        });

        dayDiv.classList.add('selected');
        
        const selectedDate = new Date(dayDiv.dataset.date).toISOString().split('T')[0];
        updateProjectionsForSelectedDate(selectedDate);
    };

    const updateProjectionsForSelectedDate = (selectedDate) => {
        hourPriceContainer.innerHTML = ''; // Limpiar cualquier contenido previo

        const dayHasProjections = projectionsData.some(proyeccion => {
            return new Date(proyeccion.fecha).toISOString().split('T')[0] === selectedDate;
        });

        if (dayHasProjections) {
            projectionsData.forEach(proyeccion => {
                const proyeccionDate = new Date(proyeccion.fecha).toISOString().split('T')[0];
                if (proyeccionDate === selectedDate) {
                    const fecha = new Date(proyeccion.fecha);
                    const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                    const precio = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(proyeccion.precio);
                    const formato = proyeccion.formato.toUpperCase();

                    const hourDiv = document.createElement('div');
                    hourDiv.className = 'hour';
                    hourDiv.onclick = () => selectHour(hourDiv);

                    const horaElement = document.createElement('h2');
                    horaElement.textContent = hora;
                    hourDiv.appendChild(horaElement);

                    const precioFormatoElement = document.createElement('p');
                    precioFormatoElement.textContent = `${precio} · ${formato}`;
                    hourDiv.appendChild(precioFormatoElement);

                    hourPriceContainer.appendChild(hourDiv);
                }
            });
        } else {
            const noProjectionMessage = document.createElement('p');
            noProjectionMessage.textContent = 'No hay función disponible para este día.';
            hourPriceContainer.appendChild(noProjectionMessage);
        }
    };

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.dataset.date = date.toISOString().split('T')[0];

        dayDiv.addEventListener('click', function() {
            selectDay(dayDiv);
        });

        const dayName = document.createElement('p');
        dayName.textContent = getDayName(date);
        const dayNumber = document.createElement('h2');
        dayNumber.textContent = date.getDate();

        dayDiv.appendChild(dayName);
        dayDiv.appendChild(dayNumber);

        daysContainer.appendChild(dayDiv);
    }

    const selectHour = (hourDiv) => {
        document.querySelectorAll('.hour').forEach(hour => {
            hour.classList.remove('selected');
        });
        hourDiv.classList.add('selected');
    };
});



// document.addEventListener('DOMContentLoaded', function() {
//     const chooseseat = document.getElementById("back");
//     chooseseat.addEventListener("click", function(event) {
//         event.preventDefault();
//         history.back();
//     });

//     const selectedMovieID = localStorage.getItem('selectedMovieID');
//     let selectNewDate = null;
//     let selectNewHour = null;

//     if (selectedMovieID) {
//         fetch(`/pelicula/proyeccion/${selectedMovieID}`)
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Proyecciones:', data);

//                 // Obtener el contenedor donde colocar las horas y precios
//                 const hourPriceContainer = document.getElementById('hour__proyection');

//                 // Crear un evento al seleccionar un día
//                 document.querySelectorAll('.day').forEach(day => {
//                     day.addEventListener('click', function() {
//                         const selectedDate = day.dataset.date;
//                         day.classList.add('seleccionada');
//                         console.log('selecionado',day);
                        
//                         // Filtrar proyecciones por la fecha seleccionada
//                         const proyeccionesFiltradas = data.proyecciones.filter(proyeccion => {
//                             const proyeccionFecha = new Date(proyeccion.fecha).toISOString().split('T')[0];
//                             return proyeccionFecha === selectedDate;
//                         });

                        
//                         hourPriceContainer.innerHTML = '';

//                         if (proyeccionesFiltradas.length > 0) {
//                             // Iterar sobre las proyecciones filtradas
//                             proyeccionesFiltradas.forEach(proyeccion => {
//                                 const fecha = new Date(proyeccion.fecha);
//                                 const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
//                                 const precio = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(proyeccion.precio);
//                                 const formato = proyeccion.formato.toUpperCase();

//                                 // Crear el elemento HTML para esta proyección
//                                 const hourDiv = document.createElement('div');
//                                 hourDiv.className = 'hour';
//                                 hourDiv.onclick = () => selectHour(hourDiv);

//                                 // Añadir la hora
//                                 const horaElement = document.createElement('h2');
//                                 horaElement.textContent = hora;
//                                 hourDiv.appendChild(horaElement);

//                                 // Añadir el precio y formato
//                                 const precioFormatoElement = document.createElement('p');
//                                 precioFormatoElement.textContent = `${precio} · ${formato}`;
//                                 hourDiv.appendChild(precioFormatoElement);

//                                 // Añadir este elemento al contenedor
//                                 hourPriceContainer.appendChild(hourDiv);
//                             });
//                         } else {
//                             // Si no hay proyecciones, mostrar un mensaje
//                             const noProyeccionMessage = document.createElement('p');
//                             noProyeccionMessage.textContent = 'No hay función disponible para este día.';
//                             noProyeccionMessage.style.color = 'red';  // Opcional: darle estilo al mensaje
//                             hourPriceContainer.appendChild(noProyeccionMessage);
//                         }
//                     });
//                 });
//             })
//             .catch(error => console.error('Error al obtener proyecciones:', error));
//     }

//     const daysContainer = document.getElementById('days-container');
//     const today = new Date();

//     const getDayName = (date) => {
//         const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//         return days[date.getDay()];
//     };

//     for (let i = 0; i < 7; i++) {
//         const date = new Date(today);
//         date.setDate(today.getDate() + i);

//         const dayDiv = document.createElement('div');
//         dayDiv.className = 'day';
//         dayDiv.dataset.date = date.toISOString().split('T')[0];

//         const dayName = document.createElement('p');
//         dayName.textContent = getDayName(date);
//         const dayNumber = document.createElement('h2');
//         dayNumber.textContent = date.getDate();

//         dayDiv.appendChild(dayName);
//         dayDiv.appendChild(dayNumber);

//         daysContainer.appendChild(dayDiv);
//     }
// });


