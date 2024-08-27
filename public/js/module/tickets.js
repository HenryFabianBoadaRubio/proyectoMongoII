document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const userIdFromEnv = localStorage.getItem('userIdFromEnv');


    fetch(`/boleto/boletos/${userId}`)
        .then(response => response.json())
        .then(tickets => {
            if (Array.isArray(tickets) && tickets.length > 0) {
                const movieDetailsPromises = tickets.map(ticket => 
                    fetch(`/pelicula/unaPelicula/${ticket.id_pelicula}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(movieData => ({
                            ...ticket,
                            movieData: movieData[0]
                        }))
                );

                return Promise.all(movieDetailsPromises);
            } else {
                throw new Error('No se encontraron boletos para el usuario.');
            }
        })
        .then(ticketsWithMovies => {
            displayTickets(ticketsWithMovies);
            const swiper = document.querySelector('swiper-container');
        swiper.initialize();
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('main').innerHTML = `<p>Error: ${error.message}</p>`;
        });
});
function displayTickets(ticketsWithMovies) {
    const container = document.querySelector('swiper-container');
    container.innerHTML = '';

    ticketsWithMovies.forEach(ticket => {
        const slideElement = document.createElement('swiper-slide');
        
        // El resto del código para crear el contenido del ticket permanece igual
        const date = new Date(ticket.fecha);
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const asientos = ticket.asientos.map(asiento => `${asiento.fila}${asiento.numero}`).join(', ');

        slideElement.innerHTML = `
            <div class="ticket">
                <section class="info-movie">
                    <div class="ticket-header">
                        <img src="${ticket.movieData.caratula2 || 'default-image.jpg'}" alt="Movie Image" class="movie-image">
                    </div>
                    <div class="movie-title">
                        <h1>${ticket.movieData.titulo}</h1>
                        <p>Show this ticket at the entrance</p>
                    </div>
                </section>
                <section class="ticket-info">
                <div class="info">
                <div class="info-cinema">
                    <div class="text-cinema">
                        <p class="label">Cinema</p>
                        <p class="value">CAMPUSLANDS</p>
                    </div>
                    <div class="image-cinema">
                        <img src="https://ugc.production.linktr.ee/ZJXG7pbLSwyitEyTNSc8_O1cTAW6KAObqc4un?io=true&size=avatar-v3_0" alt="">
                    </div>
                </div>
            </div>
            <section class="info-ticket">
                <div class="first-box">
                    <div class="info">
                        <p class="label">Date</p>
                        <p class="value">${formattedDate}</p>
                    </div>
                    <div class="info">
                        <p class="label">Time</p>
                        <p class="value">${formattedTime}</p>
                    </div>
                </div>
                <div class="second-box">
                    <div class="info">
                        <p class="label">Cinema Hall #</p>
                        <p class="value">CineCampus</p>
                    </div>
                    <div class="info">
                        <p class="label">Seats</p>
                        <p class="value">${asientos}</p> <!-- Mostrar los asientos -->
                    </div>
                </div>
                <div class="third-box">
                    <div class="info">
                        <p class="label">Cost</p>
                        <p class="value">${ticket.precio_total}</p>
                    </div>
                    <div class="info">
                        <p class="label">Order ID</p>
                        <p class="value">${ticket.numero_orden}</p>
                    </div>
                </div>

                </section>
                <div class="barcode">
                    <svg id="barcode-${ticket.numero_orden}"></svg>
                </div>
            </div>
        `;

        container.appendChild(slideElement);

        // Genera el código de barras después de que el elemento se haya añadido al DOM
        setTimeout(() => {
            JsBarcode(`#barcode-${ticket.numero_orden}`, ticket.numero_orden, {
                format: "CODE128",
                width: 3,
                height: 55,
                displayValue: false
            });
        }, 0);
    });
    // Actualiza Swiper después de agregar las diapositivas
    const swiper = document.querySelector('swiper-container');
    swiper.initialize();
}
