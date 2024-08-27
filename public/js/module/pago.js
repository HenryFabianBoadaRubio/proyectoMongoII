document.addEventListener('DOMContentLoaded', function() {
    
    const selectedMovieID = localStorage.getItem('selectedMovieID');
    let total__payment; 
    function generateRandomOrderNumber() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    if (selectedMovieID) {
        fetch(`/pelicula/proyeccion/${selectedMovieID}`)
            .then(response => response.json())
            .then(pelicula => {
                console.log('Datos completos recibidos:', pelicula);

                const contenedorImg = document.querySelector('.contenedor__img img');
                if (pelicula.caratula) {
                    contenedorImg.src = pelicula.caratula;
                } else {
                    console.error('No se encontró la propiedad "caratula" en la película.');
                }

                document.querySelector('.general__superior h3').textContent = pelicula.titulo || 'Título no disponible';
                document.querySelector('.general__superior p').textContent = pelicula.genero || 'Género no disponible';

                // La información de proyección se ha comentado, si la necesitas, descomenta estas líneas
                // const proyeccion = pelicula.proyecciones[0];
                // document.querySelector('.general__inferior h3').textContent = proyeccion.cinema || 'Cine no disponible';
                // document.querySelector('.general__inferior p').textContent = `${proyeccion.fecha || 'Fecha no disponible'}, ${proyeccion.hora || 'Hora no disponible'}`;
            })
            .catch(error => console.error('Error al obtener proyecciones:', error));
    } else {
        console.log('No se encontró información de la película seleccionada');
    }

    const ticketSelection = JSON.parse(localStorage.getItem('ticketSelection'));

    if (ticketSelection) {
        console.log('Información del ticket recuperada:', ticketSelection);
        const { date, time, seatId, price } = ticketSelection;

        const getDayName = (date) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const adjustedDate = new Date(date);
        adjustedDate.setDate(adjustedDate.getDate() + 1);

        const adjustedDayName = getDayName(adjustedDate);
        const monthName = months[adjustedDate.getMonth()];
        const dayOfMonth = adjustedDate.getDate();
        const fullDate = `${adjustedDayName}, ${dayOfMonth} ${monthName}. ${time}`;
        const format__go__cine = `${adjustedDayName}, ${dayOfMonth} ${monthName}`;
        document.getElementById('fecha__hora').textContent = fullDate;

        const orderNumber = generateRandomOrderNumber();
        document.getElementById('numero__orden').textContent = orderNumber;

        const priceNumber = parseFloat(price.replace(/[^0-9.-]/g, '')) * 1000;
        const serviceFee = (priceNumber * 0.05).toFixed(0);
        document.getElementById('valor__servicio').textContent = `$ ${serviceFee} x 1`;

        document.getElementById('asiento__compra').textContent = seatId;

        const seatRow = seatId.charAt(0);
        const seatType = ['E', 'F'].includes(seatRow) ? 'VIP SEAT' : 'REGULAR SEAT';
        document.getElementById('asiento__nombre').textContent = seatType;

        document.getElementById('valor__pago').textContent = `${price} x 1`;

        // Guardar información adicional en localStorage
        localStorage.setItem('format__go__cine', format__go__cine);
        localStorage.setItem('orderNumber', orderNumber.toString());
        localStorage.setItem('seatType', seatType);
        localStorage.setItem('serviceFee', serviceFee);

        //conversion del valor total del pago
        const prices = parseFloat(price.replace(/[^0-9.-]+/g, "")) *1000; // Multiplicar por 1000 si es necesario
        const serviceFeeValue = parseFloat(serviceFee);
        total__payment=(serviceFeeValue+prices)
        

    } else {
        console.log('No se encontró información de selección de ticket');
    }

    document.getElementById("back").addEventListener("click", function(event) {
        event.preventDefault();
        history.back();
    });

    // Configuración del temporizador de cuenta regresiva
    const countdownElement = document.getElementById('countdown');
    let timeLeft = 14 * 60 + 59;

    function updateCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (timeLeft === 0) {
            clearInterval(countdownInterval);
            window.history.back();
        } else {
            timeLeft--;
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // Función para manejar la compra del ticket
    async function handleBuyTicket() {
        const ticketSelection = JSON.parse(localStorage.getItem('ticketSelection'));
        const selectedMovieID = localStorage.getItem('selectedMovieID');

        // const usuarioID = localStorage.getItem('usuarioID'); // Asegúrate de que el ID del usuario esté disponible
        
         
        if (ticketSelection && selectedMovieID ) {
            // const { seatId, price } = ticketSelection;

            // // Preparar datos para la compra
            // const asientos = [{ fila: seatId.charAt(0), numero: parseInt(seatId.slice(1)) }];
            // console.log(asientos)
            // // const metodo_pago = 'tarjeta_credito'; // Ajusta según el método de pago que elijas

            // Extraer fila y número del seatId
            const [fila, numero] = ticketSelection.seatId.match(/([A-Z])(\d+)/).slice(1);
            const username = localStorage.getItem('username');
            const userId = localStorage.getItem('userId');
            const userIdFromEnv = localStorage.getItem('userIdFromEnv');
            const orderNumber = generateRandomOrderNumber();
            
            console.log('Usuario logueado:', username);
            console.log('ID del usuario:', userId);
            console.log('ID del usuario desde env:', userIdFromEnv);
            const response = await fetch('/boleto/nuevoBoleto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pelicula_id: selectedMovieID,
                    proyeccion_id: ticketSelection.proyeccionId,
                    usuario_id:userId,
                    asientos: [
                        {fila: fila, numero: parseInt(numero)}
                    ],

                    total_pago: total__payment,
                    numero_orden:orderNumber
                })
            });
            // console.log(asientos)
            const result = await response.json();
            console.log(result)

            if (result.error) {
                console.error('Error al registrar la compra:', result.error);
                alert(`Error: EL asiento ya fue ocupado previamente`);
            } else {
                console.log('Compra registrada exitosamente:', result);
                alert('Compra registrada exitosamente. ¡Disfruta la película!');
                window.location.href = '../views/boleto.html';
            }
        } else {
            console.error('Información de ticket o usuario no disponible.');
            alert('No se puede realizar la compra. Información de ticket o usuario no disponible.');
        }
    }

    // Evento para el botón de compra de tickets
    document.querySelector('.boton__reservacion button').addEventListener('click', function(event) {
        event.preventDefault();
        handleBuyTicket();
    });
        // Nuevo código para manejar el estado del botón de compra
        const checkboxTarjeta = document.querySelector('.radio-button input[type="checkbox"]');
        const botonCompra = document.querySelector('.boton__reservacion button');

         // Inicialmente, deshabilitamos el botón
        botonCompra.disabled = true;
        botonCompra.style.opacity = '0.5';
        botonCompra.style.cursor = 'not-allowed';

      // Función para actualizar el estado del botón
      function actualizarEstadoBoton() {
        if (checkboxTarjeta.checked) {
            botonCompra.disabled = false;
            botonCompra.style.opacity = '1';
            botonCompra.style.cursor = 'pointer';
        } else {
            botonCompra.disabled = true;
            botonCompra.style.opacity = '0.5';
            botonCompra.style.cursor = 'not-allowed';
        }
    }

       // Escuchar cambios en el checkbox
       checkboxTarjeta.addEventListener('change', actualizarEstadoBoton);
       document.querySelector('.boton__reservacion button').addEventListener('click', function(event) {
        if (!checkboxTarjeta.checked) {
            event.preventDefault();
            alert('Por favor, seleccione un método de pago antes de comprar el boleto.');
        } else {
            // Aquí puedes agregar la lógica de compra
            // Por ahora, solo permitimos la navegación al siguiente paso
            console.log('Compra iniciada');
        }
    });

});
