document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const userIdFromEnv = localStorage.getItem('userIdFromEnv');

    console.log('Usuario logueado:', username);
    console.log('ID del usuario:', userId);
    console.log('ID del usuario desde env:', userIdFromEnv);
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
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('main').innerHTML = `<p>Error: ${error.message}</p>`;
        });
});

function displayTickets(ticketsWithMovies) {
    const container = document.querySelector('main');
    container.innerHTML = '';

    ticketsWithMovies.forEach(ticket => {
        const ticketElement = document.createElement('div');
        ticketElement.className = 'ticket';

      // Crear un objeto Date a partir de la fecha y hora del ticket
      const date = new Date(ticket.fecha);

      // Formatear la fecha (día, mes, año)
      const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);

    // Formatear la hora en formato de 24 horas (sin AM/PM)
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

        // Obtener los asientos como una cadena formateada
        const asientos = ticket.asientos.map(asiento => `${asiento.fila}${asiento.numero}`).join(', ');

        ticketElement.innerHTML = `
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
                <div class="custom-dashed-line"></div>
                <div class="barcode">
                    <svg id="barcode-${ticket.numero_orden}"></svg>
                </div>
            </section>
        `;

        container.appendChild(ticketElement);

        JsBarcode(`#barcode-${ticket.numero_orden}`, ticket.numero_orden, {
            format: "CODE128", 
            width: 3,          
            height: 55,       
            displayValue: false 
        });
    });
}
