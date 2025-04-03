// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Firebase Config
    const firebaseConfig = {
        apiKey: "AIzaSyAKZOyM-LaobW0hNi1GlcksUdk214EZ-io",
        authDomain: "my-portfolio-25b2a.firebaseapp.com",
        projectId: "my-portfolio-25b2a",
        storageBucket: "my-portfolio-25b2a.firebasestorage.app",
        messagingSenderId: "683800903108",
        appId: "1:683800903108:web:a1ec6587a49e06fc893891",
        measurementId: "G-1K2CWGVZJM"
    };

    // Initialize Firebase with enhanced error handling
    let firebaseInitialized = false;
    let db = null;

    try {
        if (typeof firebase !== 'undefined') {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            console.log('Firebase initialized successfully');
            
            // Initialize Firestore
            db = firebase.firestore();
            firebaseInitialized = true;
            console.log('Firestore is available and initialized');
            
            // Initialize Analytics in production
            if (window.location.hostname !== 'localhost' && 
                window.location.hostname !== '127.0.0.1' &&
                typeof firebase.analytics === 'function') {
                firebase.analytics();
                console.log('Firebase Analytics initialized');
            }
        } else {
            console.error('Firebase SDK not loaded');
        }
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
    
    // Project data
    const projects = [
        {
            title: "Canvas Drawing Board",
            description: "An interactive drawing application that allows users to create digital artwork with various brush sizes and colors. Users can save their creations to a Firebase gallery for sharing and future reference.",
            image: "https://images.unsplash.com/photo-1597088054119-922a3eb7bb81?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FudmFzJTIwZHJhd2luZyUyMGJvYXJkfGVufDB8fDB8fHww",
            tags: ["HTML Canvas", "CSS", "JavaScript", "Firebase"],
            codeUrl: "https://github.com/AngieGichane/Canvas-Drawing-Board"
        },
        {
            title: "Sparkles Kids",
            description: "A responsive website for a children's clothing boutique. Features product displays, category navigation, and contact information.",
            image: "https://media.istockphoto.com/id/1484799147/photo/hanging-clothes-on-sale-for-teens-and-kids-in-the-mall.webp?a=1&b=1&s=612x612&w=0&k=20&c=_OEbRrSXuY-09jltAqseSrsZLTSOLfycC32dhefkt84=",
            tags: ["HTML", "CSS", "Responsive Design"],
            codeUrl: "https://github.com/AngieGichane/Rembesha-Kids-Web-Page"
        },
        {
            title: "Secure Login System",
            description: "A machine learning application that uses quantum computing principles to generate creative content and artwork.",
            image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80",
            tags: ["HTML", "PHP", "JavaScript", "Security"],
            codeUrl: "https://github.com/AngieGichane/Secure_Login_system"
        },
    ];
    
    // Render projects
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        // Create HTML for each project
        let projectsHTML = '';
        projects.forEach(project => {
            projectsHTML += `
                <div class="project-card scroll-animate">
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}">
                    </div>
                    <div class="project-content">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                        </div>
                        <div class="project-links centered">
                            ${project.codeUrl ? `<a href="${project.codeUrl}" class="button small glow-button" target="_blank">View Code</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Set the innerHTML of the projects grid
        projectsGrid.innerHTML = projectsHTML;
        console.log('Projects rendered successfully');
    } else {
        console.error('Projects grid element not found!');
    }
    
    // Setup canvas for aurora background
    const canvas = document.getElementById('auroraCanvas');
    if (canvas) {
        console.log('Canvas found, initializing aurora background');
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const numberOfParticles = 40;
        const colors = ['#9b87f5', '#7E69AB', '#33C3F0', '#8BECD4', '#FFDEE2'];
        let mousePosition = { x: 0, y: 0 };

        // Set canvas dimensions
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createParticles();
            console.log('Canvas resized:', canvas.width, 'x', canvas.height);
        };

        // Particle class
        class Particle {
            constructor(x, y, radius, color) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.radius = radius;
                this.color = color;
                this.density = (Math.random() * 30) + 5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.opacityChange = 0.01 * (Math.random() < 0.5 ? -1 : 1);
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                // Convert opacity to hex for color
                const opacityHex = Math.floor(this.opacity * 255).toString(16).padStart(2, '0');
                ctx.fillStyle = this.color + opacityHex;
                ctx.filter = 'blur(10px)';
                ctx.fill();
                ctx.filter = 'none';
            }

            update() {
                // Mouse interaction
                const dx = mousePosition.x - this.x;
                const dy = mousePosition.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Avoid division by zero
                const forceDirectionX = distance > 0 ? dx / distance : 0;
                const forceDirectionY = distance > 0 ? dy / distance : 0;
                
                // Max distance to apply force
                const maxDistance = 200;
                const force = Math.max((maxDistance - distance) / maxDistance, 0);
                
                // Movement based on force
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;

                if (distance < maxDistance) {
                    this.x += directionX;
                    this.y += directionY;
                } else {
                    // Return to original position
                    if (this.x !== this.baseX) {
                        const dx = this.x - this.baseX;
                        this.x -= dx / 20;
                    }
                    if (this.y !== this.baseY) {
                        const dy = this.y - this.baseY;
                        this.y -= dy / 20;
                    }
                }

                // Pulsating effect
                this.opacity += this.opacityChange;
                if (this.opacity <= 0.2 || this.opacity >= 0.7) {
                    this.opacityChange = -this.opacityChange;
                }
            }
        }

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < numberOfParticles; i++) {
                const radius = Math.random() * 80 + 50;
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const color = colors[Math.floor(Math.random() * colors.length)];
                particles.push(new Particle(x, y, radius, color));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#121212');
            gradient.addColorStop(1, '#1a1a2e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            animationFrameId = requestAnimationFrame(animate);
        };

        // Handle mouse movement
        const handleMouseMove = (e) => {
            mousePosition = { x: e.x, y: e.y };
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        
        resizeCanvas();
        animate();
        console.log('Aurora background animation started');
    } else {
        console.error('Canvas element not found! Make sure #auroraCanvas exists in your HTML.');
    }
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            // Toggle navigation menu
            navLinks.classList.toggle('active');
            // Toggle hamburger to X
            this.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            }
        });
    });
    
    // Contact Form Submission with Firebase
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            const timestamp = new Date();
            console.log('Form values:', {name, email, subject, message, timestamp});
            
            // Form validation
            if (!name || !email || !subject || !message) {
                showFormStatus('Please fill in all fields.', 'error');
                return;
            }
            
            // Show loading status
            showFormStatus('Sending message...', 'loading');
            
            // Save to Firebase if available
            if (firebaseInitialized && db) {
                db.collection('contacts').add({
                    name,
                    email,
                    subject,
                    message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp() // Use server timestamp
                })
                .then(() => {
                    console.log('Message saved to Firestore successfully');
                    showFormStatus('Message sent successfully!', 'success');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error("Error saving to database: ", error);
                    showFormStatus('Failed to send message. Error: ' + error.message, 'error');
                });
            } else {
                // Firebase not initialized
                console.error('Firebase not properly initialized. Cannot save data.');
                showFormStatus('Cannot connect to database. Please try again later.', 'error');
            }
        });
    }
    
    // Helper function to show form status messages
    function showFormStatus(message, type) {
        if (!formStatus) return;
        
        formStatus.textContent = message;
        formStatus.className = 'form-status';
        formStatus.classList.add(type);
        formStatus.style.display = 'block';
        
        // Auto-hide success/error messages after 5 seconds
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }
    
    // Scroll animations with fallback for older browsers
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);
        
        // Observe all elements with scroll-animate class
        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('.scroll-animate').forEach(el => {
            el.classList.add('active');
        });
    }
    
    // Sticky Header
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.padding = '0.75rem 0';
            header.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
        } else {
            header.style.padding = '1.5rem 0';
            header.style.backgroundColor = 'rgba(18, 18, 18, 0.8)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add active state to nav links based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initialize active nav link
    updateActiveNavLink();
});
