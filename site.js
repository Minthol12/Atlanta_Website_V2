document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 1. COOKIE BANNER LOGIC 
    // =======================================================

    // Check if the user has already accepted cookies
    const accepted = getCookie('user_has_consented');
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies-btn');

    if (!accepted && banner) { 
        // Show the banner if no consent cookie is found
        banner.style.display = 'block';
    }

    // Event listener for the Accept button
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            // Set the cookie for 30 days
            setCookie('user_has_consented', 'true', 30); 
            // Hide the banner
            banner.style.display = 'none';
        });
    }

    // =======================================================
    // 2. BUTTON RIPPLE EFFECT LOGIC 
    // =======================================================
    
    const ctaButtons = document.querySelectorAll('.cta-button');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Remove any existing ripple before creating a new one
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }

            // Calculate the click position relative to the button
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            const size = Math.max(rect.width, rect.height);

            // Create the new ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // Set size and starting position
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (x - size / 2) + 'px';
            ripple.style.top = (y - size / 2) + 'px';

            // Append the ripple to the button
            this.appendChild(ripple);
            
            // Clean up: Remove the ripple after the animation finishes
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });

}); // End of document.addEventListener('DOMContentLoaded', ...)