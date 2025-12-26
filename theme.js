document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the button and the <body> element
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    const body = document.body;

    // 2. Function to check the user's preference and apply it
    const loadTheme = () => {
        // Check local storage first, then default to 'dark' if nothing is set
        const currentTheme = localStorage.getItem('theme') || 'dark';

        if (currentTheme === 'light') {
            body.classList.add('light-theme');
            // Update the button icon to reflect the *next* state
            themeToggleBtn.innerHTML = '🌙'; // Moon for switching to dark
        } else {
            body.classList.remove('light-theme');
            // Update the button icon to reflect the *next* state
            themeToggleBtn.innerHTML = '💡'; // Bulb for switching to light
        }
    };

    // 3. Function to handle the actual toggle action
    const toggleTheme = () => {
        // Toggle the class on the body
        body.classList.toggle('light-theme');

        // Check the current state and save it to local storage
        if (body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '🌙'; // Show Moon
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '💡'; // Show Bulb
        }
    };

    // 4. Attach event listeners
    themeToggleBtn.addEventListener('click', toggleTheme);

    // 5. Load the stored theme immediately when the page loads
    loadTheme();
});