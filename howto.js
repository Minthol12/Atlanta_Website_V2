document.addEventListener('DOMContentLoaded', function() {
    
    // Function to handle the toggle logic for both main and nested accordions
    function setupAccordion(headerSelector, contentSelector, iconSelector) {
        const headers = document.querySelectorAll(headerSelector);
        
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.parentNode.querySelector(contentSelector);
                const icon = this.querySelector(iconSelector);
                const isExpanded = content.classList.contains('open');

                // Toggle the 'open' class for content
                content.classList.toggle('open');
                
                // Toggle aria-expanded attribute
                this.setAttribute('aria-expanded', !isExpanded);

                // Toggle icon
                if (icon) {
                    if (content.classList.contains('open')) {
                        icon.textContent = '▼'; // Down arrow when open
                    } else {
                        // Use the default icon for the specific accordion type
                        // Main Accordion uses '▼' by default, Nested uses '►' by default
                        icon.textContent = headerSelector === '.nested-accordion-header' ? '►' : '▼';
                    }
                }
            });
        });
    }

    // Setup for Main Accordions
    // Icons: '▼' (default/closed) and '▼' (open) - We'll manually set the closed icon for clarity
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.querySelector('.toggle-icon').textContent = '▼';
    });
    setupAccordion('.accordion-header', '.accordion-content', '.toggle-icon');

    // Setup for Nested Accordions
    // Icons: '►' (default/closed) and '▼' (open)
    document.querySelectorAll('.nested-accordion-header').forEach(header => {
        header.querySelector('.nested-toggle-icon').textContent = '►';
    });
    setupAccordion('.nested-accordion-header', '.nested-accordion-content', '.nested-toggle-icon');
});