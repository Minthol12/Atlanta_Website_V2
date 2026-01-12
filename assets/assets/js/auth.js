// ====================================================================
// --- SUPABASE CONFIGURATION ---
// ====================================================================
const SUPABASE_URL = 'https://wbbsjpqjyclbfnhemqhf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiYnNqcHFqeWNsYmZuaGVtcWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MTM3MjUsImV4cCI6MjA4MjQ4OTcyNX0.p8Ci9CS4ImX4D0gWo7RSkSGviKcFrIBLk0mDJtQeGUU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
<script src="assets/assets/js/auth.js"></script>

// ====================================================================
// --- CORE AUTH LOGIC ---
// ====================================================================

document.addEventListener('DOMContentLoaded', async () => {
    // 1. SESSION CHECK (Runs on every page load)
    const { data: { session } } = await supabaseClient.auth.getSession();
    const isAdminPage = document.body.classList.contains('admin-dashboard-page');

    // SECURITY: If on admin page and not logged in, kick to login
    if (isAdminPage && !session) {
        window.location.href = '../auth.html';
        return;
    }

    // AUTO-REDIRECT: If already logged in and on login page, skip to dashboard
    if (session && !!document.getElementById('loginForm')) {
        window.location.href = 'admin/admin-dashboard.html';
        return;
    }

    // UPDATE UI: Show the logged-in user's email
    if (session) {
        const display = document.querySelector('.accent-text');
        if (display) display.textContent = session.user.email.split('@')[0];
    }

    // 2. LOGIN SUBMISSION
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Supabase usually expects an Email. 
            // If you use "adminuser", make sure you created them as adminuser@example.com
            const emailInput = document.getElementById('username').value.trim();
            const passwordInput = document.getElementById('password').value.trim();

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: emailInput.includes('@') ? emailInput : `${emailInput}@yourdomain.com`,
                password: passwordInput,
            });

            if (error) {
                alert("Login Failed: " + error.message);
            } else {
                window.location.href = 'admin/admin-dashboard.html';
            }
        });
    }

    // 3. LOGOUT LOGIC
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabaseClient.auth.signOut();
            window.location.href = isAdminPage ? '../auth.html' : 'auth.html';
        });
    });
});