// ====================================================================
// --- GLOBAL FUNCTIONS & LOCAL STORAGE MANAGEMENT ---
// ====================================================================

// Function to safely get users from localStorage or set defaults
function getCredentials() {
    const savedUsers = localStorage.getItem('users');
    
    if (savedUsers) {
        // Return parsed object if it exists
        return JSON.parse(savedUsers);
    } else {
        // Set initial default user objects, using the username as the key
        const defaultUsers = {
            'student123': { password: 'password', status: 'ready', role: 'student', name: 'Standard Student' },
            'jsmith': { password: 'pass123', status: 'ready', role: 'student', name: 'Jane Smith' },
            // Admin user status is 'new', forcing a password change on first login
            'adminuser': { password: 'adminpass', status: 'new', role: 'admin', name: 'System Admin' } 
        };
        // Save the default list to localStorage for the first time
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
}

// Function to save the updated user object back to localStorage
function saveCredentials(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Load the users object once when the script starts
let USERS = getCredentials();


// Function to simulate a persistent password change
function changePassword(username, newPassword) {
    if (USERS.hasOwnProperty(username)) {
        USERS[username].password = newPassword;
        USERS[username].status = 'ready'; // Set flag to prevent future forced redirect
        
        // CRITICAL STEP: Save the updated object to localStorage
        saveCredentials(USERS); 
        
        console.log(`Password for ${username} successfully updated.`);
        return true;
    }
    return false;
}

// ====================================================================
// --- DOM CONTENT LOADED ---
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------------------------------------------
    // --- NEW: 0. SESSION CHECK AND AUTO-REDIRECT (Runs on auth.html page load) ---
    // ---------------------------------------------------------------------------------
    const currentUser = sessionStorage.getItem('currentUser');
    
    // Check if we are on the login page AND a user is already logged in
    // This is the implementation for "automatically lets you sign in"
    if (document.getElementById('container') && currentUser) {
        // Redirect based on the saved user's role/status
        if (USERS[currentUser]) {
            if (USERS[currentUser].status === 'new' && currentUser === 'adminuser') {
                 // Force password change if admin hasn't done it
                 window.location.href = 'admin-settings.html';
            } else if (USERS[currentUser].role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'student.html';
            }
        }
    }

    // ----------------------------------------------------
    // --- 1. SLIDE ANIMATION LOGIC (on auth.html) ---
    // ----------------------------------------------------
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    if (container && registerBtn && loginBtn) {
        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });
        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });
    }


    // ----------------------------------------------------
    // --- NEW: 2. SIGN UP LOGIC (on auth.html) ---
    // ----------------------------------------------------
    // We are selecting the sign-up form in the .sign-up div.
    const signUpForm = document.querySelector('.form-container.sign-up form');
    
    if (signUpForm) {
        signUpForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            // Assuming your HTML inputs are: Name, Email, Password
            const name = signUpForm.elements[0].value.trim();
            const email = signUpForm.elements[1].value.trim();
            const password = signUpForm.elements[2].value.trim();

            if (!name || !email || !password) {
                alert("Please fill in all fields to create an account.");
                return;
            }

            // Use the email as the unique username (key in the USERS object)
            const newUsername = email.toLowerCase(); 

            // Check if the username already exists
            if (USERS.hasOwnProperty(newUsername)) {
                alert("An account with this email/username already exists. Please sign in.");
                return;
            }

            // Create new user object and store it
            USERS[newUsername] = { 
                password: password, 
                status: 'ready', // New users don't need a forced password change
                role: 'student', // All sign-ups are assumed to be students
                name: name 
            };
            saveCredentials(USERS); // Save the updated USERS object

            // Log the new user in and redirect (required for "should let me enter the school website")
            sessionStorage.setItem('currentUser', newUsername);

            alert("Account created successfully! Redirecting to Student Hub.");
            window.location.href = 'student.html'; // Direct to the main school website/student page
        });
    }

    
    // ----------------------------------------------------
    // --- 3. LOGIN VALIDATION LOGIC (on auth.html) ---
    // ----------------------------------------------------
    
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const usernameInput = document.getElementById('username').value.trim();
            const passwordInput = document.getElementById('password').value.trim();
            
            // Check against the dynamically loaded USERS object
            if (USERS.hasOwnProperty(usernameInput) && USERS[usernameInput].password === passwordInput) {
                
                // Save the current user to simulate a session
                sessionStorage.setItem('currentUser', usernameInput); 

                const user = USERS[usernameInput];
                
                // Successful Login Redirection Logic
                if (usernameInput === 'adminuser') {
                    // Check if the password has already been changed (status is 'new')
                    if (user.status === 'new') {
                        alert("Admin Login Successful! Please set a new password for security.");
                        window.location.href = 'admin-settings.html'; // FORCED REDIRECT
                    } else {
                        // Password already changed, redirect straight to dashboard
                        alert("Admin Login Successful! Redirecting to Dashboard.");
                        window.location.href = 'admin-dashboard.html'; // DIRECT REDIRECT
                    }
                } else {
                    alert("Student Login Successful! Redirecting to Student Hub.");
                    window.location.href = 'student.html';
                }
                
            } else {
                alert("Authentication Failed: Invalid Username or Password.");
            }
        });
    }

    // ----------------------------------------------------
    // --- 4. PASSWORD CHANGE FORM LOGIC (on admin-settings.html) ---
    // ----------------------------------------------------

    const passwordForm = document.getElementById('passwordUpdateForm');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const currentUser = sessionStorage.getItem('currentUser');
            
            // 1. Get all password inputs
            const currentPassword = document.getElementById('currentPassword').value.trim();
            const newPassword = document.getElementById('newPassword').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            
            if (!currentUser) {
                alert("Error: No active session. Please log in again.");
                window.location.href = 'auth.html';
                return;
            }

            // Retrieve the stored password for the current user from the global USERS object
            const storedPassword = USERS[currentUser].password; 
            
            // --- SECURITY CHECK 1: VERIFY CURRENT PASSWORD ---
            if (currentPassword !== storedPassword) {
                alert("Incorrect Current Password. Please try again.");
                return;
            }

            // --- SECURITY CHECK 2: PREVENT REUSING CURRENT PASSWORD ---
            if (newPassword === storedPassword) {
                alert("The new password cannot be the same as the current password.");
                return;
            }

            // --- PASSWORD REQUIREMENTS (8+ chars, 1 capital, 1 special) ---
            if (newPassword.length < 8) {
                alert("New password must be at least 8 characters long.");
                return;
            }
            if (!/[A-Z]/.test(newPassword)) {
                alert("New password must contain at least 1 capital letter (A-Z).");
                return;
            }
            if (!/[^a-zA-Z0-9\s]/.test(newPassword)) {
                alert("New password must contain at least 1 special character (e.g., !, @, #, $).");
                return;
            }

            // 5. Check for Match
            if (newPassword !== confirmPassword) {
                alert("New password and confirmation password do not match.");
                return;
            }
            
            // If all checks pass, proceed to change the password
            if (changePassword(currentUser, newPassword)) {
                alert("Password successfully updated! Redirecting to dashboard.");
                window.location.href = 'admin-dashboard.html';
            } else {
                alert("Password update failed. User not found in session.");
            }
        });
    }

    // ----------------------------------------------------
    // --- 5. SESSION MANAGEMENT (on protected pages) ---
    // ----------------------------------------------------

    // This runs on pages that require login (admin-dashboard.html, student.html, etc.)
    if (document.body.classList.contains('admin-dashboard-page') || 
        document.body.classList.contains('student-page') || 
        document.body.classList.contains('admin-settings-page')) { // Added settings page check
        
        const currentUser = sessionStorage.getItem('currentUser');
        const userExists = USERS.hasOwnProperty(currentUser);
        
        // Simple check to ensure a user is logged in
        if (!currentUser || !userExists) {
            alert("Session expired or unauthorized access. Please log in.");
            sessionStorage.removeItem('currentUser');
            window.location.href = 'auth.html';
            return;
        }

        // Display current username on the dashboard
        const usernameSpan = document.querySelector('.accent-text');
        if (usernameSpan) {
            usernameSpan.textContent = USERS[currentUser].name || currentUser;
        }

        // Add Log Out functionality (for all links/buttons with the class 'logout-btn')
        document.querySelectorAll('.logout-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('currentUser');
                alert("You have been logged out.");
                window.location.href = 'auth.html';
            });
        });
    }
});