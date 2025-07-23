// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission handling
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const postcode = formData.get('postcode');
            const newsletter = formData.get('newsletter');
            
            // Basic validation
            if (!firstName || !lastName || !email || !postcode) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Postcode validation (basic Australian format)
            const postcodeRegex = /^\d{4}$/;
            if (!postcodeRegex.test(postcode)) {
                alert('Please enter a valid 4-digit postcode.');
                return;
            }
            
            // Real API call to backend
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Joining...';
            submitButton.disabled = true;
            
            // Prepare data for API
            const memberData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                postcode: postcode,
                newsletterOptIn: newsletter === 'on'
            };
            
            // Call the backend API
            fetch('https://hbg-budget-app-7.onrender.com/api/members/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(memberData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.innerHTML = `
                    <div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center;">
                        <strong>Welcome to the movement!</strong><br>
                        Thank you for joining Homes Before Growth. We'll be in touch soon with updates on our campaign.
                    </div>
                `;
                
                signupForm.appendChild(successMessage);
                
                // Reset form
                signupForm.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            })
            .catch(error => {
                console.error('Signup error:', error);
                
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.innerHTML = `
                    <div style="background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center;">
                        <strong>Signup failed</strong><br>
                        ${error.message || 'Please try again later.'}
                    </div>
                `;
                
                signupForm.appendChild(errorMessage);
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            });
        });
    }

    // Animate chart bars on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chartBars = entry.target.querySelectorAll('.chart-bar');
                chartBars.forEach(bar => {
                    bar.style.width = bar.style.width || bar.getAttribute('style').match(/width:\s*([^;]+)/)[1];
                });
            }
        });
    }, observerOptions);

    const problemSection = document.querySelector('.problem-chart');
    if (problemSection) {
        observer.observe(problemSection);
    }

    // Add scroll effect to header
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add loading animation for vision and solution cards
    const cards = document.querySelectorAll('.vision-card, .solution-card');
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to stats
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        stat.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        stat.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add click-to-copy functionality for key statistics
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        stat.style.cursor = 'pointer';
        stat.title = 'Click to copy';
        
        stat.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Show a brief tooltip
                const tooltip = document.createElement('div');
                tooltip.textContent = 'Copied!';
                tooltip.style.cssText = `
                    position: absolute;
                    background: #333;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                this.appendChild(tooltip);
                
                setTimeout(() => {
                    tooltip.remove();
                }, 1000);
            });
        });
    });
}); 