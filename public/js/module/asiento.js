document.addEventListener('DOMContentLoaded', function() {
    const chooseseat = document.getElementById("back");
    chooseseat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back();
    });

    const selectedMovieID = localStorage.getItem('selectedMovieID');
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
    const seatsContainer = document.getElementById('seats-container'); // Agrega este contenedor
    const seatsContainerF = document.getElementById('seats-container-f'); // Agrega este contenedor
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
                    hourDiv.className = 'hour time'; // Añadido 'time' para la selección de hora
                    hourDiv.dataset.proyeccionId = proyeccion._id; // Añade el ObjectId a cada hora
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

        // Agregar la lógica para manejar la selección de hora y obtener asientos
        document.querySelectorAll('.time').forEach(time => {
            time.addEventListener('click', async function () {
                document.querySelectorAll('.time').forEach(t => t.classList.remove('selected'));
                this.classList.add('selected');

                // Obtener la fecha y la hora seleccionadas
                const selectedDay = document.querySelector('.day.selected');
                const selectedDate = selectedDay ? selectedDay.dataset.date : '';
                const selectedHour = this.querySelector('h2').textContent.trim();
                const proyeccionId = this.dataset.proyeccionId; // Obtener el ObjectId de la proyección

                // Llamar a la función para obtener asientos
                await fetchSeatsForProjection(proyeccionId);
            });
        });
    };

    const fetchSeatsForProjection = async (proyeccionId) => {
        try {
            const response = await fetch(`/asiento/asientosParaSala/${proyeccionId}`);
            const data = await response.json();
            console.log('Datos de la API:', data);
            
            // Limpiar el contenedor de asientos
            seatsContainerF.innerHTML = '';
    
            if (data.asientos && Array.isArray(data.asientos)) {
                // Agrupar asientos por fila
                const filas = data.asientos.reduce((acc, asiento) => {
                    if (!acc[asiento.fila]) {
                        acc[asiento.fila] = [];
                    }
                    acc[asiento.fila].push(asiento);
                    return acc;
                }, {});
    
                // Crear HTML para cada fila
                for (const fila in filas) {
                    const filaDiv = document.createElement('div');
                    filaDiv.className = 'fila';
    
                    // Aplicar clase adicional para filas A y B
                    if (fila === 'B') {
                        filaDiv.classList.add('fila--separada');
                    }
    
                    const filaLabel = document.createElement('small');
                    filaLabel.className = 'fila-label';
                    filaLabel.textContent = fila;
                    filaDiv.appendChild(filaLabel);
                    
                    const asientosDiv = document.createElement('div');
                    asientosDiv.className = 'asientos__lista';
    
                    filas[fila].forEach(asiento => {
                        const asientoButton = document.createElement('button');
                        asientoButton.textContent = asiento.numero;
                        if (!asiento.disponible) {
                            asientoButton.className = 'ocupado'; // Asegúrate de definir esta clase en tu CSS
                            asientoButton.style.pointerEvents = 'none'; // Desactivar clics en asientos ocupados
                        }
                        asientosDiv.appendChild(asientoButton);
                    });
    
                    filaDiv.appendChild(asientosDiv);
                    seatsContainerF.appendChild(filaDiv);
                }
            } else {
                seatsContainerF.innerHTML = '<p>No hay asientos disponibles.</p>';
            }
    
        } catch (error) {
            console.error('Error al obtener los asientos:', error);
            seatsContainerF.innerHTML = '<p>Error al obtener los asientos.</p>';
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
//     let projectionsData = [];

//     if (selectedMovieID) {
//         fetch(`/pelicula/proyeccion/${selectedMovieID}`)
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Proyecciones:', data);
//                 projectionsData = data.proyecciones; // Guardar las proyecciones para utilizarlas luego
//             })
//             .catch(error => console.error('Error al obtener proyecciones:', error));
//     }

//     const daysContainer = document.getElementById('days-container');
//     const hourPriceContainer = document.getElementById('hour__proyection');
//     const today = new Date();

//     const getDayName = (date) => {
//         const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//         return days[date.getDay()];
//     };

//     const selectDay = (dayDiv) => {
//         document.querySelectorAll('.days .day').forEach(day => {
//             day.classList.remove('selected');
//         });

//         dayDiv.classList.add('selected');
        
//         const selectedDate = new Date(dayDiv.dataset.date).toISOString().split('T')[0];
//         updateProjectionsForSelectedDate(selectedDate);
//     };

//     const updateProjectionsForSelectedDate = (selectedDate) => {
//         hourPriceContainer.innerHTML = ''; // Limpiar cualquier contenido previo

//         const dayHasProjections = projectionsData.some(proyeccion => {
//             return new Date(proyeccion.fecha).toISOString().split('T')[0] === selectedDate;
//         });

//         if (dayHasProjections) {
//             projectionsData.forEach(proyeccion => {
//                 const proyeccionDate = new Date(proyeccion.fecha).toISOString().split('T')[0];
//                 if (proyeccionDate === selectedDate) {
//                     const fecha = new Date(proyeccion.fecha);
//                     const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
//                     const precio = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(proyeccion.precio);
//                     const formato = proyeccion.formato.toUpperCase();

//                     const hourDiv = document.createElement('div');
//                     hourDiv.className = 'hour';
//                     hourDiv.onclick = () => selectHour(hourDiv);

//                     const horaElement = document.createElement('h2');
//                     horaElement.textContent = hora;
//                     hourDiv.appendChild(horaElement);

//                     const precioFormatoElement = document.createElement('p');
//                     precioFormatoElement.textContent = `${precio} · ${formato}`;
//                     hourDiv.appendChild(precioFormatoElement);

//                     hourPriceContainer.appendChild(hourDiv);
//                 }
//             });
//         } else {
//             const noProjectionMessage = document.createElement('p');
//             noProjectionMessage.textContent = 'No hay función disponible para este día.';
//             hourPriceContainer.appendChild(noProjectionMessage);
//         }
//     };

//     for (let i = 0; i < 7; i++) {
//         const date = new Date(today);
//         date.setDate(today.getDate() + i);

//         const dayDiv = document.createElement('div');
//         dayDiv.className = 'day';
//         dayDiv.dataset.date = date.toISOString().split('T')[0];

//         dayDiv.addEventListener('click', function() {
//             selectDay(dayDiv);
//         });

//         const dayName = document.createElement('p');
//         dayName.textContent = getDayName(date);
//         const dayNumber = document.createElement('h2');
//         dayNumber.textContent = date.getDate();

//         dayDiv.appendChild(dayName);
//         dayDiv.appendChild(dayNumber);

//         daysContainer.appendChild(dayDiv);
//     }

//     const selectHour = (hourDiv) => {
//         document.querySelectorAll('.hour').forEach(hour => {
//             hour.classList.remove('selected');
//         });
//         hourDiv.classList.add('selected');
//     };
// });

