document.addEventListener("DOMContentLoaded", function() {
    const selectedMovieID = localStorage.getItem('selectedMovieID');
    const ticketSelection = JSON.parse(localStorage.getItem('ticketSelection'));
    const orderNumber = localStorage.getItem('orderNumber');
    const format__go__cine = localStorage.getItem('format__go__cine');
    const seatType = localStorage.getItem('seatType');
    const serviceFee = localStorage.getItem('serviceFee');
    
    console.log(ticketSelection);

    if (selectedMovieID) {
        fetch(`/pelicula/proyeccion/${selectedMovieID}`)
            .then(response => response.json())
            .then(pelicula => {
                console.log('Datos completos recibidos:', pelicula);

                // 1) Colocar la carátula en el contenedor img__header
                const imgHeader = document.querySelector('.img__header img');
                if (pelicula.caratula2) {
                    imgHeader.src = pelicula.caratula2;
                } else {
                    console.error('No se encontró la propiedad "caratula" en la película.');
                }

                // 2) Colocar el título de la película en img__info
                document.querySelector('.img__info h2').textContent = pelicula.titulo || 'Título no disponible';

                // 3) Colocar la información de la función en fecha__funcion
                document.getElementById('fecha__funcion').textContent = format__go__cine || 'Fecha no disponible';

                // 4) Colocar la hora en hora__info
                document.querySelector('.hora__info h4').textContent = ticketSelection.time || 'Hora no disponible';

                // 5) Colocar el asiento en asiento__info
                document.querySelector('.asiento__info h4').textContent = ticketSelection.seatId || 'Asiento no disponible';

                // 6) Colocar el número de orden en numero__orden
                document.querySelector('.numero__orden h4').textContent = orderNumber || 'Número de orden no disponible';

                // 7) Calcular y colocar el pago total en pago__info
                const price = parseFloat(ticketSelection.price.replace(/[^0-9.-]+/g, "")) *1000; // Multiplicar por 1000 si es necesario
                const serviceFeeValue = parseFloat(serviceFee); // Multiplicar por 1000 si es necesario
                const totalPayment = (price + serviceFeeValue);
        
                
                // Formatear en pesos colombianos
                const formattedTotalPayment = totalPayment.toLocaleString('es-CO', { style: 'currency', currency: 'COP',maximumFractionDigits: 0  });
                
                document.querySelector('.pago__info h4').textContent = formattedTotalPayment;
                
            })
            .catch(error => console.error('Error al obtener proyecciones:', error));
    } else {
        console.log('No se encontró información de la película seleccionada');
    }
    const barcode = `${orderNumber}`
    JsBarcode("#barcode", barcode, {
        format: "CODE128", 
        width: 3.75,
        height: 60,
        displayValue: false 
    });
});
