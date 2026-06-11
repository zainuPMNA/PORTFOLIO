/**
 * Zainul Abid.M Portfolio Website - Interactive Script
 * Theme: Quantum Physics + Data Science
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Mobile Menu Toggling
       ========================================================================== */
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navMenuLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when clicking a link
        navMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }


    /* ==========================================================================
       2. Sticky Header & Scroll Progress
       ========================================================================== */
    const header = document.getElementById('main-header');
    const scrollProgress = document.getElementById('scroll-progress-indicator');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Sticky class
        if (header) {
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Scroll Progress indicator
        if (scrollProgress && docHeight > 0) {
            const pct = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${pct}%`;
        }
    });


    /* ==========================================================================
       3. Scroll Reveal Animations (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve after revealing to prevent repeated triggering
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12, // Trigger when 12% of the element is visible
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ==========================================================================
       4. Active Navigation Link Highlighting on Scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinksArray = Array.from(navMenuLinks);

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // offset for nav bar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinksArray.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       5. Contact Form Submission & Modal Feedback
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');

    if (contactForm && successModal) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple validation
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (name && email && subject && message) {
                const submitBtn = document.getElementById('btn-submit-form');
                const origBtnText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                // URL to Google Forms formResponse endpoint
                const formUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSc7qhFESOly3HqU3_TwW8k61uB1dX912OtcOb_Wuqu78SLkQw/formResponse";
                
                // Construct URL-encoded form data parameters
                const formData = new URLSearchParams();
                formData.append("entry.429891072", name);       // NAME
                formData.append("entry.456961483", email);      // Email
                formData.append("entry.2078815239", `Subject: ${subject}\n\nMessage:\n${message}`); // Message
                formData.append("fvv", "1");
                formData.append("pageHistory", "0");
                formData.append("fbzx", "7722246556921670744");

                fetch(formUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData.toString()
                })
                .then(() => {
                    // Reset form and show success modal
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origBtnText;
                    successModal.classList.add('active');
                })
                .catch((error) => {
                    console.error('Submission error:', error);
                    // Fallback to still showing the modal to the user
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origBtnText;
                    successModal.classList.add('active');
                });
            }
        });
    }

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });

        // Close on clicking overlay background
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }


    /* ==========================================================================
       6. Quantum & Data Canvas Wave/Particle Simulation
       ========================================================================== */
    const canvas = document.getElementById('quantum-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Particle configuration
        const particleCount = Math.min(60, Math.floor((width * height) / 20000));
        const particles = [];
        const mouse = { x: null, y: null, radius: 150 };

        // Handle resize
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle class definition
        class QuantumParticle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1; // particle radius
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(127, 0, 255, 0.3)';
                this.baseSize = this.size;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce boundaries
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction (Repel / Glow)
                if (mouse.x != null && mouse.y != null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        // Gently attract particles to form a focus cluster, or push back
                        const angle = Math.atan2(dy, dx);
                        this.x += Math.cos(angle) * force * 1.2;
                        this.y += Math.sin(angle) * force * 1.2;
                        this.size = this.baseSize * (1 + force * 1.5);
                    } else {
                        if (this.size > this.baseSize) {
                            this.size -= 0.1;
                        }
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = this.size * 2;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0; // reset shadow
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new QuantumParticle());
        }

        // Wave parameters (representing physical quantum waves)
        let waveTime = 0;
        const wave = {
            y: height * 0.65,
            length: 0.003,
            amplitude: 45,
            frequency: 0.012
        };

        const wave2 = {
            y: height * 0.35,
            length: 0.002,
            amplitude: 30,
            frequency: 0.008
        };

        // Draw quantum wave lines in background
        function drawQuantumWave(w, color, timeOffset) {
            ctx.beginPath();
            ctx.moveTo(0, w.y);
            
            for (let i = 0; i < width; i += 2) {
                // Calculate y coordinate based on multiple sine terms (interference)
                const sineVal = Math.sin(i * w.length + waveTime + timeOffset);
                const cosineVal = Math.cos(i * (w.length * 1.5) - waveTime + timeOffset);
                const yVal = w.y + (sineVal + cosineVal * 0.5) * w.amplitude;
                
                ctx.lineTo(i, yVal);
            }
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Connect particles close to each other
        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // If distance is short, draw a connector line (neural/data graph concept)
                    if (dist < 110) {
                        const alpha = (110 - dist) / 110 * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw wave animations
            drawQuantumWave(wave, 'rgba(0, 242, 254, 0.05)', 0);
            drawQuantumWave(wave2, 'rgba(127, 0, 255, 0.03)', Math.PI / 4);

            // Update & Draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Connect neighboring particles (neural mesh effect)
            connectParticles();

            // Increment time for waves
            waveTime += 0.004;

            requestAnimationFrame(animate);
        }

        animate();
    }
});
