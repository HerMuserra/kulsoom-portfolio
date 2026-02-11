// -----------------------------------------------------------------
// script.js: Interactive Enhancements (Smooth Scroll, Sticky Header, Fade-In)
// -----------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth' 
                });
            }
        });
    });

    // 2. Sticky Header Class Toggle
    const header = document.querySelector('.navbar');

    function toggleStickyHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', toggleStickyHeader);
    toggleStickyHeader(); 

    // 3. Section Fade-In on Scroll (using Intersection Observer)
    const sections = document.querySelectorAll('.section, .hero');
    
    const observerOptions = {
        root: null, 
        threshold: 0.1, 
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions); 

    sections.forEach(section => {
        section.classList.add('hidden'); 
        sectionObserver.observe(section);
    });
});