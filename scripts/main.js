document.addEventListener('DOMContentLoaded', () => {
    // Hero copy variants
    const heroCopy = {
        local: {
            badge: 'Customer Discovery Platform',
            headline: 'Your Next Customer Is Already Looking for You.',
            subheadline: 'People are publicly asking for the services you offer. We find those requests and send them to you every day as ready-to-contact customers.',
            cta: 'Find My Customers'
        },
        b2b: {
            badge: 'Lead Intelligence Platform',
            headline: 'Your Next Client Is Already Looking for You.',
            subheadline: 'Businesses are publicly asking for the services you offer. We find those requests and send them to you every day as ready-to-contact leads.',
            cta: 'Start My Lead Search'
        }
    };

    function updateHeroCopy(isB2B) {
        const copy = isB2B ? heroCopy.b2b : heroCopy.local;
        const badge = document.querySelector('[data-hero-badge]');
        const headline = document.querySelector('[data-hero-headline]');
        const subheadline = document.querySelector('[data-hero-subheadline]');
        const cta = document.querySelector('[data-hero-cta]');

        if (badge) badge.textContent = copy.badge;
        if (headline) headline.textContent = copy.headline;
        if (subheadline) subheadline.textContent = copy.subheadline;
        if (cta) cta.textContent = copy.cta;
    }

    // Carousel functionality (click only, no auto-rotate)
    function initCarousels() {
        const carousels = document.querySelectorAll('.carousel');

        carousels.forEach(carousel => {
            const tabs = carousel.querySelectorAll('.carousel-tab');
            const slides = carousel.querySelectorAll('.carousel-slide');
            const isHeroCarousel = carousel.dataset.carousel === 'hero';

            function showSlide(index) {
                // Update slides
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                });
                // Update tabs
                tabs.forEach((tab, i) => {
                    tab.classList.toggle('active', i === index);
                });

                // Update hero copy if this is the hero carousel
                if (isHeroCarousel) {
                    updateHeroCopy(index === 1); // index 1 = B2B
                }
            }

            // Tab click handlers
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    showSlide(index);
                });
            });
        });
    }

    initCarousels();

    // Countdown Timer
    function updateCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;

        // Get or set the end time (7 days from now or from localStorage)
        let endTime = localStorage.getItem('countdownEndTime');
        if (!endTime) {
            endTime = new Date();
            endTime.setDate(endTime.getDate() + 7);
            localStorage.setItem('countdownEndTime', endTime.getTime());
        } else {
            endTime = new Date(parseInt(endTime));
            // If expired, reset to new 7-day period
            if (endTime < new Date()) {
                endTime = new Date();
                endTime.setDate(endTime.getDate() + 7);
                localStorage.setItem('countdownEndTime', endTime.getTime());
            }
        }

        function updateTimer() {
            const now = new Date();
            const diff = endTime - now;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countdownElement.textContent = `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Spots Counter
    function updateSpotsCounter() {
        const spotsElement = document.getElementById('spots-counter');
        if (!spotsElement) return;

        let spots = localStorage.getItem('spotsLeft');
        if (!spots) {
            spots = 74;
            localStorage.setItem('spotsLeft', spots);
        }

        spotsElement.textContent = spots;

        // Randomly decrease spots (30% chance every 10 seconds)
        setInterval(() => {
            if (Math.random() < 0.3 && spots > 1) {
                spots--;
                localStorage.setItem('spotsLeft', spots);
                spotsElement.textContent = spots;
            }
        }, 10000);
    }

    // Initialize countdown and spots counter
    updateCountdown();
    updateSpotsCounter();

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active'); 
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : '';
        spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : '';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking a link
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = '';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = '';
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.feature-card, .benefit-card, .step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });

    // Form submission handling
    const signupForm = document.getElementById('signup-form');
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'spinner';
    loadingSpinner.style.display = 'none';
    signupForm.parentElement.insertBefore(loadingSpinner, signupForm.nextSibling);

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = signupForm.querySelector('input[type="email"]').value;
        
        // Show loading state
        const button = signupForm.querySelector('button');
        const originalText = button.textContent;
        button.disabled = true;
        signupForm.style.display = 'none';
        loadingSpinner.style.display = 'flex';

        try {
            // Save email to file
            const response = await fetch('/save-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to save email');
            }

            // Redirect to dashboard
            window.location.href = 'https://create-react-app-nu-amber-87.vercel.app/dashboard';
        } catch (error) {
            console.error('Error:', error);
            // Reset form on error
            button.disabled = false;
            button.textContent = originalText;
            signupForm.style.display = 'flex';
            loadingSpinner.style.display = 'none';
        }
    });

    // Add scroll-based navbar background
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'none';
        } else {
            navbar.style.boxShadow = 'var(--card-shadow)';
        }

        lastScroll = currentScroll;
    });
});
