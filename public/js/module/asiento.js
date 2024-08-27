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
                projectionsData = data.proyecciones;
            })
            .catch(error => console.error('Error al obtener proyecciones:', error));
    }

    const daysContainer = document.getElementById('days-container');
    const hourPriceContainer = document.getElementById('hour__proyection');
    const seatsContainerF = document.getElementById('seats-container-f');
    const today = new Date();

    let selectedSeat = null; 
    let selectedProjection = {
        date: null,
        time: null,
        proyeccionId: null
    };
    const precioElement = document.querySelector('.precio h2');
    const buyTicketButton = document.querySelector('.book-now');


   
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
        const dayName = getDayName(new Date(dayDiv.dataset.date));
        selectedProjection.date = selectedDate;
        selectedProjection.time = null;
        selectedProjection.proyeccionId = null;
        selectedProjection.dayName = dayName;
        selectedProjection.basePrice = null;
        selectedSeat = null;
        updateProjectionsForSelectedDate(selectedDate);
        saveSelectionToLocalStorage();
        updatePrice(); // Limpiar el precio al cambiar de día
        updateBuyButtonState();
    };

    
    
    const restoreOriginalSeatsStructure = () => {
        seatsContainerF.innerHTML = `
            <div class="fila fila--separada2"><small class="fila-label">A</small>
                <div class="asientos__lista">
                    <button>1</button><button>2</button><button>3</button><button>4</button><button>5</button></div>
            </div>
            <div class="fila fila--separada"><small class="fila-label">B</small>
                <div class="asientos__lista"><button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button><button>7</button>
                </div>
            </div>
            <div class="fila"><small class="fila-label">C</small>
                <div class="asientos__lista">
                    <button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button><button>7</button><button>8</button><button>9</button>
                </div>
            </div>
            <div class="fila"><small class="fila-label">D</small>
                <div class="asientos__lista">
                    <button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button><button>7</button><button>8</button><button>9</button>
                </div>
            </div>
            <div class="fila"><small class="fila-label">E</small>
                <div class="asientos__lista">
                    <button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button><button>7</button><button>8</button><button>9</button>
                </div>
            </div>
            <div class="fila"><small class="fila-label">F</small>
                <div class="asientos__lista">
                    <button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button><button>7</button><button>8</button><button>9</button>
                </div>
            </div>
        `;
    };

    const updateProjectionsForSelectedDate = (selectedDate) => {
        hourPriceContainer.innerHTML = '';
        restoreOriginalSeatsStructure();

        const dayHasProjections = projectionsData.some(proyeccion => {
            return new Date(proyeccion.fecha).toISOString().split('T')[0] === selectedDate;
        });


        if (dayHasProjections) {
            projectionsData.forEach(proyeccion => {
                const proyeccionDate = new Date(proyeccion.fecha).toISOString().split('T')[0];
                if (proyeccionDate === selectedDate) {
                    const fecha = new Date(proyeccion.fecha);
                    const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                    const precio = proyeccion.precio;
                    const formato = proyeccion.formato.toUpperCase();

                    const hourDiv = document.createElement('div');
                    hourDiv.className = 'hour time';
                    hourDiv.dataset.proyeccionId = proyeccion._id;
                    hourDiv.dataset.precio = precio;
                    hourDiv.onclick = () => selectHour(hourDiv);

                    const horaElement = document.createElement('h2');
                    horaElement.textContent = hora;
                    hourDiv.appendChild(horaElement);

                    const precioFormatoElement = document.createElement('p');
                    precioFormatoElement.textContent = `${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio)} · ${formato}`;
                    hourDiv.appendChild(precioFormatoElement);

                    hourPriceContainer.appendChild(hourDiv);
                }
            });
        } else {
            const noProjectionMessage = document.createElement('p');
            noProjectionMessage.textContent = 'No hay función disponible para este día.';
            hourPriceContainer.appendChild(noProjectionMessage);
        }

        document.querySelectorAll('.time').forEach(time => {
            time.addEventListener('click', async function () {
                document.querySelectorAll('.time').forEach(t => t.classList.remove('selected'));
                this.classList.add('selected');
                const proyeccionId = this.dataset.proyeccionId;
                selectedProjection.time = this.querySelector('h2').textContent;
                selectedProjection.proyeccionId = proyeccionId;
                selectedProjection.basePrice = parseFloat(this.dataset.precio);
                selectedSeat = null; // Limpiar la selección de asiento al cambiar de hora
                await fetchSeatsForProjection(proyeccionId);
                console.log('Proyección seleccionada:', selectedProjection);
                updatePrice();
                updateBuyButtonState();
                saveSelectionToLocalStorage();
            });
        });
    };
     const fetchSeatsForProjection = async (proyeccionId) => {
        try {
            const response = await fetch(`/asiento/asientosParaSala/${proyeccionId}`);
            const data = await response.json();
            console.log('Datos de la API:', data);
            
            seatsContainerF.innerHTML = '';
    
            if (data.asientos && Array.isArray(data.asientos)) {
                const filas = data.asientos.reduce((acc, asiento) => {
                    if (!acc[asiento.fila]) {
                        acc[asiento.fila] = [];
                    }
                    acc[asiento.fila].push(asiento);
                    return acc;
                }, {});
    
                for (const fila in filas) {
                    const filaDiv = document.createElement('div');
                    filaDiv.className = 'fila';
                    if (fila === 'A') {
                        filaDiv.classList.add('fila--separada2');
                    }
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
                        asientoButton.dataset.seatId = `${fila}${asiento.numero}`;
                        if (!asiento.disponible) {
                            asientoButton.className = 'ocupado';
                            asientoButton.style.pointerEvents = 'none';
                        } else {
                            asientoButton.addEventListener('click', () => selectSeat(asientoButton));
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
    

    const selectSeat = (seatButton) => {
        if (seatButton === selectedSeat) {
            seatButton.classList.remove('selected');
            selectedSeat = null;
            console.log('Asiento deseleccionado');
        } else {
            if (selectedSeat) {
                selectedSeat.classList.remove('selected');
            }
            seatButton.classList.add('selected');
            selectedSeat = seatButton;
            console.log('Asiento seleccionado:', selectedSeat.dataset.seatId);
        }
        updatePrice();
        updateBuyButtonState();
        saveSelectionToLocalStorage();
    };
   const saveSelectionToLocalStorage = () => {
    if (selectedProjection.date && selectedProjection.time && selectedSeat) {
        const selectionData = {
            date: selectedProjection.date,
            dayName: selectedProjection.dayName,
            time: selectedProjection.time,
            proyeccionId: selectedProjection.proyeccionId,
            seatId: selectedSeat ? selectedSeat.dataset.seatId : null,
            price: precioElement.textContent
        };
        localStorage.setItem('ticketSelection', JSON.stringify(selectionData));
    } else {
        localStorage.removeItem('ticketSelection');
    }
};
    const updatePrice = () => {
        if (selectedSeat && selectedProjection.basePrice) {
            const fila = selectedSeat.dataset.seatId[0];
            let precio = selectedProjection.basePrice;
            
            if (fila === 'E' || fila === 'F') {
                precio *= 1.3; // Aumenta el precio en un 30% para filas VIP
            }
            
            precioElement.textContent = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio);
        } else {
            precioElement.textContent = '$0';
        }
    };

    const updateBuyButtonState = () => {
        if (selectedProjection.date && selectedProjection.time && selectedSeat) {
            buyTicketButton.disabled = false;
            buyTicketButton.style.opacity = '1';
            buyTicketButton.style.cursor = 'pointer';
        } else {
            buyTicketButton.disabled = true;
            buyTicketButton.style.opacity = '0.5';
            buyTicketButton.style.cursor = 'not-allowed';
        }
    };

    buyTicketButton.addEventListener('click', function(event) {
        if (this.disabled) {
            event.preventDefault();
        }
    });

    // Inicializar el estado del botón
    updateBuyButtonState();
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
















/** ORIGINAL */

// document.addEventListener('DOMContentLoaded', function() {
//     const chooseseat = document.getElementById("back");
//     chooseseat.addEventListener("click", function(event) {
//         event.preventDefault();
//         history.back();
//     });

//     const selectedMovieID = localStorage.getItem('selectedMovieID');
//     let projectionsData = [];

//     if (selectedMovieID) {
//         fetch(`/pelicula/proyeccion/${selectedMovieID}`)
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Proyecciones:', data);
//                 projectionsData = data.proyecciones;
//             })
//             .catch(error => console.error('Error al obtener proyecciones:', error));
//     }

//     const daysContainer = document.getElementById('days-container');
//     const hourPriceContainer = document.getElementById('hour__proyection');
//     const seatsContainerF = document.getElementById('seats-container-f');
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

//     const restoreOriginalSeatsStructure = () => {
//         seatsContainerF.innerHTML = `
//             <div class="fila"><small class="fila-label">A</small>
//                 <div class="asientos__lista">
//                     <button>1</button><button>2</button><button>3</button><button>4</button><button>5</button></div>
//             </div>
//             <div class="fila fila--separada"><small class="fila-label">B</small>
//                 <div class="asientos__lista"><button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button><button>7</button>
//                 </div>
//             </div>
//             <div class="fila"><small class="fila-label">C</small>
//                 <div class="asientos__lista">
//                     <button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button><button>7</button><button>8</button><button>9</button>
//                 </div>
//             </div>
//             <div class="fila"><small class="fila-label">D</small>
//                 <div class="asientos__lista">
//                     <button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button><button>7</button><button>8</button><button>9</button>
//                 </div>
//             </div>
//             <div class="fila"><small class="fila-label">E</small>
//                 <div class="asientos__lista">
//                     <button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button><button>7</button><button>8</button><button>9</button>
//                 </div>
//             </div>
//             <div class="fila"><small class="fila-label">F</small>
//                 <div class="asientos__lista">
//                     <button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button><button>7</button><button>8</button><button>9</button>
//                 </div>
//             </div>
//         `;
//     };

//     const updateProjectionsForSelectedDate = (selectedDate) => {
//         hourPriceContainer.innerHTML = '';
//         restoreOriginalSeatsStructure();

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
//                     hourDiv.className = 'hour time';
//                     hourDiv.dataset.proyeccionId = proyeccion._id;
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

//         document.querySelectorAll('.time').forEach(time => {
//             time.addEventListener('click', async function () {
//                 document.querySelectorAll('.time').forEach(t => t.classList.remove('selected'));
//                 this.classList.add('selected');
//                 const proyeccionId = this.dataset.proyeccionId;
//                 await fetchSeatsForProjection(proyeccionId);
//             });
//         });
//     };

//     const fetchSeatsForProjection = async (proyeccionId) => {
//         try {
//             const response = await fetch(`/asiento/asientosParaSala/${proyeccionId}`);
//             const data = await response.json();
//             console.log('Datos de la API:', data);
            
//             seatsContainerF.innerHTML = '';
    
//             if (data.asientos && Array.isArray(data.asientos)) {
//                 const filas = data.asientos.reduce((acc, asiento) => {
//                     if (!acc[asiento.fila]) {
//                         acc[asiento.fila] = [];
//                     }
//                     acc[asiento.fila].push(asiento);
//                     return acc;
//                 }, {});
    
//                 for (const fila in filas) {
//                     const filaDiv = document.createElement('div');
//                     filaDiv.className = 'fila';
    
//                     if (fila === 'B') {
//                         filaDiv.classList.add('fila--separada');
//                     }
    
//                     const filaLabel = document.createElement('small');
//                     filaLabel.className = 'fila-label';
//                     filaLabel.textContent = fila;
//                     filaDiv.appendChild(filaLabel);
                    
//                     const asientosDiv = document.createElement('div');
//                     asientosDiv.className = 'asientos__lista';
    
//                     filas[fila].forEach(asiento => {
//                         const asientoButton = document.createElement('button');
//                         asientoButton.textContent = asiento.numero;
//                         if (!asiento.disponible) {
//                             asientoButton.className = 'ocupado';
//                             asientoButton.style.pointerEvents = 'none';
//                         }
//                         asientosDiv.appendChild(asientoButton);
//                     });
    
//                     filaDiv.appendChild(asientosDiv);
//                     seatsContainerF.appendChild(filaDiv);
//                 }
//             } else {
//                 seatsContainerF.innerHTML = '<p>No hay asientos disponibles.</p>';
//             }
    
//         } catch (error) {
//             console.error('Error al obtener los asientos:', error);
//             seatsContainerF.innerHTML = '<p>Error al obtener los asientos.</p>';
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


