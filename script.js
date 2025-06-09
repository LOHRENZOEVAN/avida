// Simple Mobile Menu - Clean and Working
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('mobile-toggle');
    const nav = document.getElementById('main-nav');
    
    if (hamburger && nav) {
        // Toggle menu when hamburger is clicked
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            nav.classList.toggle('mobile-active');
            
            // Change icon
            const icon = hamburger.querySelector('i');
            if (nav.classList.contains('mobile-active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close menu when nav links are clicked
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('mobile-active');
                hamburger.querySelector('i').className = 'fas fa-bars';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('mobile-active');
                hamburger.querySelector('i').className = 'fas fa-bars';
            }
        });
        
        // Close menu when window is resized to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                nav.classList.remove('mobile-active');
                hamburger.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
});

// FIXED: Form validation that works WITH Formspree (doesn't prevent submission)
document.addEventListener('DOMContentLoaded', function() {
    // Quote Form - Client-side validation BEFORE Formspree submission
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            // Get form data
            const formData = new FormData(this);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Validate required fields
            const requiredFields = ['fullName', '_replyto', 'phone', 'serviceType'];
            let isValid = true;
            let errorMessage = '';
            
            requiredFields.forEach(field => {
                const fieldValue = data[field] || data['email']; // Handle both _replyto and email
                if (!fieldValue || fieldValue.trim() === '') {
                    isValid = false;
                    errorMessage += `${getFieldLabel(field)} is required.\n`;
                }
            });
            
            // Validate email format
            const email = data['_replyto'] || data['email'];
            if (email && !isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Please enter a valid email address.\n';
            }
            
            // Validate phone format
            if (data.phone && !isValidPhone(data.phone)) {
                isValid = false;
                errorMessage += 'Please enter a valid phone number.\n';
            }
            
            // CRITICAL: Only prevent submission if validation fails
            if (!isValid) {
                e.preventDefault(); // ONLY prevent if there are errors
                showAlert('Please correct the following errors:\n' + errorMessage, 'error');
                return false;
            }
            
            // If validation passes, let Formspree handle the submission
            // Show loading message
            showAlert('Sending quote request...', 'info');
            
            // Form will submit normally to Formspree
            return true;
        });
    }
    
    // Contact Form - Same approach
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Get form data
            const formData = new FormData(this);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Validate required fields
            const requiredFields = ['contactName', 'contactEmail', 'contactMessage'];
            let isValid = true;
            let errorMessage = '';
            
            requiredFields.forEach(field => {
                if (!data[field] || data[field].trim() === '') {
                    isValid = false;
                    errorMessage += `${getFieldLabel(field)} is required.\n`;
                }
            });
            
            // Validate email format
            if (data.contactEmail && !isValidEmail(data.contactEmail)) {
                isValid = false;
                errorMessage += 'Please enter a valid email address.\n';
            }
            
            // CRITICAL: Only prevent submission if validation fails
            if (!isValid) {
                e.preventDefault(); // ONLY prevent if there are errors
                showAlert('Please correct the following errors:\n' + errorMessage, 'error');
                return false;
            }
            
            // If validation passes, let Formspree handle the submission
            showAlert('Sending message...', 'info');
            return true;
        });
    }
});

// Utility Functions
function getFieldLabel(fieldName) {
    const labels = {
        'fullName': 'Full Name',
        'email': 'Email Address',
        '_replyto': 'Email Address',
        'phone': 'Phone Number',
        'serviceType': 'Service Type',
        'contactName': 'Full Name',
        'contactEmail': 'Email Address',
        'contactMessage': 'Message'
    };
    return labels[fieldName] || fieldName;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Accept various phone formats including international
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        word-wrap: break-word;
        font-family: 'Segoe UI', sans-serif;
        font-size: 14px;
        line-height: 1.5;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation styles to document head if not already present
    if (!document.querySelector('#alert-animations')) {
        const style = document.createElement('style');
        style.id = 'alert-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
    `;
    closeBtn.addEventListener('click', () => removeAlert(alert));
    
    alert.appendChild(closeBtn);
    alert.appendChild(document.createTextNode(message));
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => removeAlert(alert), 5000);
}

function removeAlert(alert) {
    if (alert && alert.parentNode) {
        alert.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }
}

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Scroll to Top Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #1e3a8a;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effect
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(30, 58, 138, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(30, 58, 138, 0.3)';
    });
});

// Product Search Functionality (for products page)
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const productItems = document.querySelectorAll('.product-item');
            
            productItems.forEach(item => {
                const productName = item.querySelector('h3').textContent.toLowerCase();
                const productDesc = item.querySelector('p').textContent.toLowerCase();
                
                if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});

// Analytics and Tracking (placeholder for future implementation)
function trackEvent(eventName, eventData) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track form submissions (modified to not interfere with Formspree)
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            // Only track if form is valid and will actually submit
            trackEvent('form_submit', {
                form_id: this.id || 'unknown',
                page_url: window.location.href
            });
        });
    });
});

// Track button clicks
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('button_click', {
                button_text: this.textContent.trim(),
                button_class: this.className,
                page_url: window.location.href
            });
        });
    });
});