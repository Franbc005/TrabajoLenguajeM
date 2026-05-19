const elements = {
    preloader: document.getElementById('preloader'),
    particles: document.getElementById('particles'),
    lights: document.getElementById('lights'),
    navbar: document.getElementById('navbar'),
    navLinks: document.getElementById('navLinks'),
    hamburger: document.getElementById('hamburger'),
    toggleMusic: document.getElementById('toggleMusic'),
    scrollTop: document.getElementById('scrollTop'),
    reservationForm: document.getElementById('reservationForm'),
    formMessage: document.getElementById('formMessage'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};

const state = {
    isMusicOn: false,
    hasScrolled: false
};

function init() {
    createParticles();
    setupEventListeners();
    startCountdown();
    addRevealClasses();
    checkScroll();
    
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1500);
}

function createParticles() {
    if (!elements.particles) return;
    
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        applyRandomParticleStyles(particle);
        fragment.appendChild(particle);
    }
    
    elements.particles.appendChild(fragment);
    
    document.querySelectorAll('.particle').forEach(particle => {
        particle.addEventListener('animationiteration', () => {
            applyRandomParticleStyles(particle);
        });
    });
}

function applyRandomParticleStyles(particle) {
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 10;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;
}

function setupEventListeners() {
    if (elements.toggleMusic) {
        elements.toggleMusic.addEventListener('click', toggleMusicLights);
    }
    
    if (elements.hamburger) {
        elements.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                closeMobileMenu();
                smoothScrollTo(href);
            }
        });
    });
    
    window.addEventListener('scroll', () => {
        checkScroll();
        updateActiveNavLink();
        checkReveal();
    });
    
    if (elements.scrollTop) {
        elements.scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    if (elements.reservationForm) {
        elements.reservationForm.addEventListener('submit', handleFormSubmit);
    }
    
    document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('error');
        });
    });
    
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = today;
    }
}

function toggleMusicLights() {
    state.isMusicOn = !state.isMusicOn;
    
    if (elements.lights) {
        elements.lights.classList.toggle('active', state.isMusicOn);
    }
    
    if (elements.toggleMusic) {
        const btnText = elements.toggleMusic.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = state.isMusicOn ? 'Apagar Música' : 'Encender Música';
        }
        elements.toggleMusic.classList.toggle('btn-secondary', state.isMusicOn);
    }
}

function toggleMobileMenu() {
    if (elements.hamburger) {
        elements.hamburger.classList.toggle('active');
    }
    if (elements.navLinks) {
        elements.navLinks.classList.toggle('active');
    }
}

function closeMobileMenu() {
    if (elements.hamburger) {
        elements.hamburger.classList.remove('active');
    }
    if (elements.navLinks) {
        elements.navLinks.classList.remove('active');
    }
}

function checkScroll() {
    const scrollY = window.scrollY;
    
    if (elements.navbar) {
        if (scrollY > 50 && !state.hasScrolled) {
            elements.navbar.classList.add('scrolled');
            state.hasScrolled = true;
        } else if (scrollY <= 50 && state.hasScrolled) {
            elements.navbar.classList.remove('scrolled');
            state.hasScrolled = false;
        }
    }
    
    if (elements.scrollTop) {
        if (scrollY > 500) {
            elements.scrollTop.classList.add('visible');
        } else {
            elements.scrollTop.classList.remove('visible');
        }
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function addRevealClasses() {
    const revealElements = document.querySelectorAll(
        '.glass-card, .section-title, .about-grid > *, .events-grid > *, .gallery-item, .contact-info, .map-placeholder, .footer-brand, .footer-links'
    );
    
    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
    });
    
    checkReveal();
}

function checkReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
}

function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function startCountdown() {
    if (!elements.hours || !elements.minutes || !elements.seconds) return;
    
    function update() {
        const now = new Date();
        const target = new Date(now);
        
        const day = now.getDay();
        let targetHour = 22;
        
        if (day === 0) targetHour = 21;
        else if (day === 4 || day === 5) targetHour = 22;
        else if (day === 6) targetHour = 22;
        
        target.setHours(targetHour, 0, 0, 0);
        
        if (now > target) {
            target.setDate(target.getDate() + 1);
        }
        
        const diff = target - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        
        elements.hours.textContent = String(h).padStart(2, '0');
        elements.minutes.textContent = String(m).padStart(2, '0');
        elements.seconds.textContent = String(s).padStart(2, '0');
    }
    
    update();
    setInterval(update, 1000);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (elements.formMessage) {
        elements.formMessage.className = 'form-message';
        elements.formMessage.style.display = 'none';
    }
    
    const form = e.target;
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';
        }
        
        setTimeout(() => {
            if (elements.formMessage) {
                elements.formMessage.textContent = '¡Reserva confirmada! Nos pondremos en contacto contigo pronto.';
                elements.formMessage.className = 'form-message success';
                elements.formMessage.style.display = 'block';
            }
            
            form.reset();
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
            
            setTimeout(() => {
                if (elements.formMessage) {
                    elements.formMessage.style.display = 'none';
                }
            }, 5000);
        }, 1500);
    } else {
        if (elements.formMessage) {
            elements.formMessage.textContent = 'Por favor, corrige los errores del formulario.';
            elements.formMessage.className = 'form-message error';
            elements.formMessage.style.display = 'block';
        }
    }
}

function validateField(input) {
    const group = input.closest('.form-group');
    const errorEl = group?.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';
    
    const value = input.value.trim();
    const name = input.name || input.id;
    
    if (input.required && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    } else if (value) {
        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Introduce un email válido';
                }
                break;
                
            case 'phone':
                const phoneRegex = /^[+\d\s()-]{6,}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Introduce un teléfono válido';
                }
                break;
                
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                }
                break;
        }
    }
    
    if (group) {
        group.classList.toggle('error', !isValid);
    }
    
    if (errorEl) {
        errorEl.textContent = errorMessage;
    }
    
    return isValid;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
