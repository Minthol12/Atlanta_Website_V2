document.addEventListener('DOMContentLoaded', function() {
    // Set the target date: May 10, 2026 (Month is 0-indexed, so May is 4)
    const graduationDate = new Date(2026, 4, 10, 18, 0, 0).getTime(); // Setting time to 6:00 PM

    // Get the element where the countdown will be displayed
    const countdownElement = document.getElementById('countdown-display');

    // Function to update the countdown every second
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = graduationDate - now;

        // Calculations for days, hours, minutes, and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result
        if (distance > 0) {
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            // When the countdown is finished
            clearInterval(timerInterval);
            countdownElement.innerHTML = "CONGRATULATIONS, GRADUATES!";
            countdownElement.style.color = 'lime'; 
        }
    };

    // Run the function once immediately to avoid a 1-second delay
    updateCountdown();

    // Update the countdown every 1 second (1000 milliseconds)
    const timerInterval = setInterval(updateCountdown, 1000);
});