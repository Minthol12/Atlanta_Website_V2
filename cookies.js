// ===============================================
// CORE COOKIE MANAGEMENT FUNCTIONS
// ===============================================

/**
 * Sets a new cookie or updates an existing one.
 * @param {string} name - The name of the cookie (e.g., 'sessionID').
 * @param {string} value - The value to store (e.g., 'user_12345').
 * @param {number} days - The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        // Calculate expiration date
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Set the cookie string. The 'path=/' makes it accessible across the entire site.
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; Secure; SameSite=Lax";
}


/**
 * Retrieves the value of a specific cookie.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} - The cookie value, or null if not found.
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Deletes a cookie by setting its expiration date to the past.
 * @param {string} name - The name of the cookie to delete.
 */
function deleteCookie(name) {   
    // Setting days to -1 immediately expires the cookie
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}