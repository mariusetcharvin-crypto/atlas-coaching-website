// Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form handling
const rdvForm = document.querySelector('#rdvForm');
if (rdvForm) {
    rdvForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const preference = formData.get('preference');
        const disponibilite = formData.get('disponibilite');
        const objectifs = formData.get('objectifs');

        // Validation
        if (!name || !email || !phone || !preference || !disponibilite) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        if (!isValidPhone(phone)) {
            showNotification('Veuillez entrer un numéro de téléphone valide.', 'error');
            return;
        }

        // Create email content
        const subject = `Nouvelle demande de RDV - ${name}`;
        const body = `
Nouvelle demande de consultation gratuite :

Nom : ${name}
Email : ${email}
Téléphone : ${phone}
Préférence de contact : ${preference}
Disponibilités : ${disponibilite}
Objectifs : ${objectifs || 'Non renseignés'}

Date de la demande : ${new Date().toLocaleString('fr-FR')}
        `.trim();

        // Open email client
        const mailtoLink = `mailto:atlaslyon.net@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        
        showNotification('Votre demande a été envoyée ! Je vous recontacterai dans les 24h.', 'success');
        this.reset();
    });
}

// Validation functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.mission-item, .timeline-item, .relevance-content, .pricing-card, .pricing-guarantee');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Add pricing card interactions
    initPricingInteractions();
});

// Pricing card interactions
function initPricingInteractions() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('featured')) {
                card.style.transform = 'translateY(0) scale(1.05)';
            } else {
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
        
        // Add click animation
        card.addEventListener('click', (e) => {
            if (e.target.closest('.pricing-button')) return; // Don't animate if clicking button
            
            card.style.transform = 'translateY(-5px) scale(0.98)';
            setTimeout(() => {
                if (card.classList.contains('featured')) {
                    card.style.transform = 'translateY(0) scale(1.05)';
                } else {
                    card.style.transform = 'translateY(0) scale(1)';
                }
            }, 150);
        });
    });
    
    // Add pricing button interactions
    const pricingButtons = document.querySelectorAll('.pricing-button');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add click animation
            button.style.transform = 'translateY(0) scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            }, 100);
            
            // Scroll to contact form
            const contactSection = document.querySelector('#rdv');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Show notification
            showNotification('Redirection vers le formulaire de contact...', 'info');
        });
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`;
document.head.appendChild(style);

// Gestion des boutons de réservation
document.addEventListener('DOMContentLoaded', function() {
    const heroRdvBtn = document.getElementById('hero-rdv-btn');
    const contactForm = document.querySelector('.contact-form');
    
    // Bouton Hero - RDV direct
    if (heroRdvBtn) {
        heroRdvBtn.addEventListener('click', function(e) {
            e.preventDefault();
            createGoogleCalendarEvent({
                name: 'Client potentiel',
                email: 'atlaslyon.net@gmail.com',
                phone: '',
                message: 'Consultation gratuite de 20 minutes'
            });
        });
    }
    
    // Formulaire de contact
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Créer un événement Google Calendar avec Google Meet
            createGoogleCalendarEvent({
                name: name,
                email: email,
                phone: phone,
                message: message
            });
            
            // Afficher un message de confirmation
            showNotification('Redirection vers Google Calendar...', 'success');
        });
    }
});

// Fonction pour créer un événement Google Calendar avec Google Meet
function createGoogleCalendarEvent(eventData) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Demain à 10h
    startDate.setHours(10, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(10, 20, 0, 0); // 20 minutes
    
    const event = {
        summary: '1er RDV Gratuit - ' + eventData.name,
        description: `Client: ${eventData.name}\nEmail: ${eventData.email}\nTéléphone: ${eventData.phone}\nMessage: ${eventData.message}\n\nConsultation gratuite de 20 minutes avec Atlas Lyon.`,
        start: {
            dateTime: startDate.toISOString(),
            timeZone: 'Europe/Paris'
        },
        end: {
            dateTime: endDate.toISOString(),
            timeZone: 'Europe/Paris'
        },
        location: 'Google Meet',
        attendees: [
            { email: 'atlaslyon.net@gmail.com' },
            { email: eventData.email }
        ]
    };
    
    // Créer l'URL Google Calendar avec Google Meet
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.summary)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&add=${encodeURIComponent('atlaslyon.net@gmail.com')}&add=${encodeURIComponent(eventData.email)}`;
    
    window.open(calendarUrl, '_blank');
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-blue);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Gestion des boutons de formules
document.addEventListener('DOMContentLoaded', function() {
    // ... code existant ...
    
    // Gestion des boutons de formules
    const formulaButtons = document.querySelectorAll('.rdv-btn');
    formulaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const formula = this.getAttribute('data-formula');
            
            createGoogleCalendarEvent({
                name: 'Client potentiel',
                email: 'atlaslyon.net@gmail.com',
                phone: '',
                message: `Intéressé par la ${formula} - Consultation gratuite de 20 minutes`
            });
        });
    });
});