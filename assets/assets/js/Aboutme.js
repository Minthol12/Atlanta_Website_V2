const bg = document.getElementById('animated-bg');

// --- ANIMATION PARAMETERS ---
let scale = 1.0;
const scaleIncrement = 0.0002; // How fast the image scales up (0.0002 is slow and subtle)
const maxScale = 1.3;          // Max zoom level (30% larger than original)

function animateBackground() {
    // 1. Increase the scale slightly
    scale += scaleIncrement;

    // 2. Check if the scale has hit the maximum zoom level
    if (scale >= maxScale) {
        // If it's maxed out, instantly reset it to the original size (1.0)
        // This creates a seamless "pop" and continuous zoom loop.
        scale = 1.0;
    }

    // 3. Apply the scaling transformation to the image
    // Using CSS transform: scale() is very performance-efficient.
    bg.style.transform = `scale(${scale})`;

    // 4. Request the next frame of the animation
    requestAnimationFrame(animateBackground);
}

// Start the animation loop once the page is ready
if (bg) {
    animateBackground();
}