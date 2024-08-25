document.addEventListener('DOMContentLoaded', function() {
    const selectedMovieID = localStorage.getItem('selectedMovieID'); // Obtener el ID de la película seleccionada

    // Función para generar un número de orden aleatorio
    function generateRandomOrderNumber() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    if (selectedMovieID) {
        fetch(`/pelicula/proyeccion/${selectedMovieID}`)
            .then(response => response.json())
            .then(data => {
                console.log('Datos completos recibidos:', data);

                // Accediendo a las propiedades directamente del objeto `data`
                const pelicula = data; // `data` contiene directamente la información de la película

                // Insertar la carátula de la película en el contenedor__img
                const contenedorImg = document.querySelector('.contenedor__img img');
                if (pelicula.caratula) {
                    contenedorImg.src = pelicula.caratula;
                } else {
                    console.error('No se encontró la propiedad "caratula" en la película.');
                }

                // Insertar el título y género de la película en general__superior
                const tituloPelicula = document.querySelector('.general__superior h3');
                const generoPelicula = document.querySelector('.general__superior p');
                tituloPelicula.textContent = pelicula.titulo || 'Título no disponible';
                generoPelicula.textContent = pelicula.genero || 'Género no disponible';

                // Insertar otros detalles de la primera proyección en general__inferior
                const proyeccion = pelicula.proyecciones[0]; // Asumiendo que tomas la primera proyección
                const cineFecha = document.querySelector('.general__inferior h3');
                const cineFechaHora = document.querySelector('.general__inferior p');
                // cineFecha.textContent = proyeccion.cinema || 'Cine no disponible';
                // cineFechaHora.textContent = `${proyeccion.fecha || 'Fecha no disponible'}, ${proyeccion.hora || 'Hora no disponible'}`;
            })
            .catch(error => console.error('Error al obtener proyecciones:', error));
    } else {
        console.log('No se encontró información de la película seleccionada');
        // Manejar el caso cuando no hay información guardada
        // Podrías redirigir al usuario a la página de selección de películas
        // window.location.href = 'pagina_seleccion_peliculas.html';
    }

    const ticketSelection = JSON.parse(localStorage.getItem('ticketSelection'));

    if (ticketSelection) {
        console.log('Información del ticket recuperada:', ticketSelection);
        const { dayName, date, time, seatId, price } = ticketSelection;
        const getDayName = (date) => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return days[date.getDay()];
        };

        // Ajustar la fecha
        const currentDate = new Date(date);
        const adjustedDate = new Date(currentDate);
        adjustedDate.setDate(currentDate.getDate() + 1); // Sumar 1 día

        const dates = new Date(ticketSelection.date);
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthName = months[dates.getMonth()];
        const dayOfMonth = adjustedDate.getDate();
        const adjustedDateMonth = `${dayOfMonth} de ${monthName}`;

        // Obtener el nombre del día ajustado
        const adjustedDayName = getDayName(adjustedDate);
        document.getElementById('fecha__hora').textContent = `${adjustedDayName}, ${adjustedDateMonth}. ${time}`;

        // Agregar el número de orden aleatorio
        document.getElementById('numero__orden').textContent = generateRandomOrderNumber();

        // Calcular y mostrar la tarifa de servicio
        const priceNumber = parseFloat(price.replace(/[^0-9.-]/g, '')); // Convertir el precio a número
        const serviceFee = (priceNumber * 0.05).toFixed(2); // Calcular la tarifa de servicio
        document.getElementById('valor__servicio').textContent = `$ ${serviceFee} x 1`;

        document.getElementById('asiento__compra').textContent = seatId;

        // Ajustar el nombre del asiento
        const seatRow = seatId.charAt(0);
        const asientoPago = document.getElementById('asiento__nombre');
        if (['E', 'F'].includes(seatRow)) {
            asientoPago.textContent = 'VIP SEAT';
        } else if (['A', 'B', 'C', 'D'].includes(seatRow)) {
            asientoPago.textContent = 'REGULAR SEAT';
        }

        // Mostrar el valor total del pago
        document.getElementById('valor__pago').textContent = `${price} x 1`;
    } else {
        console.log('No se encontró información de selección de ticket');
        // Manejar el caso cuando no hay información guardada
        // Podrías redirigir al usuario a la página de selección de asientos
        // window.location.href = 'pagina_seleccion_asientos.html';
    }

    // Funcionalidad del botón para volver atrás
    const choose__seat = document.getElementById("back");
    choose__seat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back();
    });

    // Configuración del temporizador de cuenta regresiva
    const countdownElement = document.getElementById('countdown');
    let timeLeft = 14 * 60 + 59; // 14 minutos y 59 segundos en segundos

    function updateCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft === 0) {
            clearInterval(countdownInterval);
            // Redirigir a la página anterior
            window.history.back();
        } else {
            timeLeft--;
        }
    }

    // Actualizar el contador cada segundo
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Iniciar el contador inmediatamente
    updateCountdown();
});
