document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawing-area');
    const submitBtn = document.querySelector('.challenge-submit-btn');
    
    // Safety check: ensure elements exist
    if (!canvas || !submitBtn) {
        console.error("Canvas or Submit button not found!");
        return; 
    }

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let drawingStarted = false; 

    // Set line properties
    ctx.strokeStyle = '#00FF00'; 
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 8; 

    // --- Drawing Logic (Corrected for Alignment) ---
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y); 
        ctx.stroke();
        
        [lastX, lastY] = [x, y]; 
        drawingStarted = true;
    }

    // --- Event Listeners ---
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        [lastX, lastY] = [x, y]; 
    });

    canvas.addEventListener('mousemove', draw);
    
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        
        // 1. Enable button and update text
        if (drawingStarted) { 
            submitBtn.disabled = false;
            submitBtn.textContent = 'SUBMIT PROOF'; // Update button text
        }
    });
    
    canvas.addEventListener('mouseout', () => {
        isDrawing = false;
    });

    // 2. ADD THE CLICK HANDLER FOR NAVIGATION
    submitBtn.addEventListener('click', (e) => {
        // Prevent the button from submitting a form if it's inside one (best practice)
        e.preventDefault(); 
        
        if (!submitBtn.disabled) {
            // Redirect the user to the new page!
            window.location.href = 'proof-complete.html'; 
        }
    });
});