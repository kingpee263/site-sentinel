// ===== Setup Data =====
const setups = [
    { src: "step-index-m30.jpg", name: "Step Index M30", category: "Synthetic Index" },
    { src: "xauusd-gold-m30.jpg", name: "XAUUSD Gold M30", category: "Forex Pair" },
    { src: "audjpy-1h.jpg", name: "AUDJPY 1H", category: "Forex Pair" },
    { src: "gbpcad-h1.jpg", name: "GBPCAD H1", category: "Forex Pair" },
    { src: "volatility-100-m15.jpg", name: "Volatility 100 (1s) M15", category: "Volatility Index" },
    { src: "gainx-999-m15.jpg", name: "GainX 999 M15", category: "Synthetic Index" },
    { src: "fx-vol-40-m30.jpg", name: "FX Vol 40 M30", category: "Volatility Index" },
    { src: "gainx-999-h1.jpg", name: "GainX 999 H1", category: "Synthetic Index" }
];

// ===== Mobile Menu =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
const closeIcon = mobileMenuBtn.querySelector('.close-icon');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link-mobile').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    });
});

// ===== Header Scroll Effect =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.background = 'hsla(222, 47%, 8%, 0.95)';
    } else {
        header.style.background = 'hsla(222, 47%, 6%, 0.8)';
    }
});

// ===== Carousel =====
const carousel = document.getElementById('carousel');
const carouselDots = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
const visibleCount = 4;
const totalPages = Math.ceil(setups.length / visibleCount);
let autoRotateInterval;

function renderCarousel() {
    const startIndex = currentIndex * visibleCount;
    const visibleSetups = setups.slice(startIndex, startIndex + visibleCount);
    
    carousel.innerHTML = visibleSetups.map((setup, index) => `
        <div class="setup-card glass-card hover-glow" style="animation-delay: ${index * 0.1}s">
            <div class="setup-image-wrapper">
                <img src="${setup.src}" alt="${setup.name}" class="setup-image">
                <div class="setup-overlay"></div>
            </div>
            <div class="setup-info">
                <span class="setup-category">${setup.category}</span>
                <h3 class="setup-name">${setup.name}</h3>
            </div>
        </div>
    `).join('');
}

function renderDots() {
    carouselDots.innerHTML = Array.from({ length: totalPages }, (_, index) => `
        <button class="carousel-dot ${index === currentIndex ? 'active' : ''}" data-index="${index}"></button>
    `).join('');
    
    document.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.dataset.index);
            renderCarousel();
            renderDots();
            resetAutoRotate();
        });
    });
}

function goToPrev() {
    currentIndex = (currentIndex - 1 + totalPages) % totalPages;
    renderCarousel();
    renderDots();
    resetAutoRotate();
}

function goToNext() {
    currentIndex = (currentIndex + 1) % totalPages;
    renderCarousel();
    renderDots();
    resetAutoRotate();
}

function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalPages;
        renderCarousel();
        renderDots();
    }, 30000); // 30 seconds
}

function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    startAutoRotate();
}

prevBtn.addEventListener('click', goToPrev);
nextBtn.addEventListener('click', goToNext);

// Initialize carousel
renderCarousel();
renderDots();
startAutoRotate();

// ===== Modal =====
const modal = document.getElementById('setupsModal');
const modalGrid = document.getElementById('modalGrid');
const viewMoreBtn = document.getElementById('viewMoreBtn');
const closeModal = document.getElementById('closeModal');

function renderModalGrid() {
    modalGrid.innerHTML = setups.map((setup, index) => `
        <div class="setup-card glass-card">
            <div class="setup-image-wrapper">
                <img src="${setup.src}" alt="${setup.name}" class="setup-image">
            </div>
            <div class="setup-info">
                <span class="setup-category">${setup.category}</span>
                <h3 class="setup-name">${setup.name}</h3>
            </div>
        </div>
    `).join('');
}

viewMoreBtn.addEventListener('click', () => {
    renderModalGrid();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    clearInterval(autoRotateInterval);
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    startAutoRotate();
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        startAutoRotate();
    }
});

// ===== Accordion =====
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all accordion items
        document.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== Animated Counters =====
const statValues = document.querySelectorAll('.stat-value[data-target]');

const observerOptions = {
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const target = parseInt(element.dataset.target);
            animateCounter(element, target);
            counterObserver.unobserve(element);
        }
    });
}, observerOptions);

statValues.forEach(stat => {
    counterObserver.observe(stat);
});

function animateCounter(element, target) {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    const whatsappMessage = `Hi, I'm ${name}.\n\nEmail: ${email}\n\nMessage: ${message}`;
    const whatsappUrl = `https://wa.me/263781498828?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank');
    
    showToast('Redirecting to WhatsApp', 'Your message will be sent via WhatsApp.');
    
    contactForm.reset();
});

// ===== Toast Notification =====
function showToast(title, message) {
    const toast = document.getElementById('toast');
    
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
    `;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.glass-card, .section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});
