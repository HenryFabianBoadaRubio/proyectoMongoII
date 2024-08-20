document.addEventListener('DOMContentLoaded', function() {

  
        const choose__seat = document.getElementById("back")
        choose__seat.addEventListener("click", function(event) {
            event.preventDefault();
            history.back()
        })
   
    const countdownElement = document.getElementById('countdown');
    let timeLeft = 14 * 60 + 59; // 4 minutos y 59 segundos en segundos
    // let timeLeft =  9;
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