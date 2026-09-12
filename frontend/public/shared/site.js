/* =====================================================================
   SHARED SITE BEHAVIOR
   Runs on every page: icon rendering, dark mode toggle, copyright year,
   scroll-reveal animation, and smooth-scroll for in-page "#" links.
   Include this AFTER <site-nav> / <site-footer> so those elements exist.
===================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    // Render Lucide icons (including any added by site-nav/site-footer)
    if (window.lucide) lucide.createIcons();

    // Set copyright year (site-footer always renders a #year span)
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Dark Mode Logic
    const htmlClasses = document.documentElement.classList;
    const themeToggles = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')];

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlClasses.add('dark');
    } else {
        htmlClasses.remove('dark');
    }

    function toggleTheme() {
        if (htmlClasses.contains('dark')) {
            htmlClasses.remove('dark');
            localStorage.theme = 'light';
        } else {
            htmlClasses.add('dark');
            localStorage.theme = 'dark';
        }
    }
    themeToggles.forEach(btn => { if (btn) btn.addEventListener('click', toggleTheme); });

    // Smooth-scroll for any in-page "#" link marked with .scroll-link
    document.querySelectorAll('.scroll-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navOffset = 64; // nav bar height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navOffset;

                    targetElement.classList.add('animate-pulse');
                    setTimeout(() => targetElement.classList.remove('animate-pulse'), 1500);

                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // Scroll Reveal Animation (Smooth scaling reveal)
    function reveal() {
        var reveals = document.querySelectorAll('.reveal');
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 100; // Trigger threshold
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
    window.addEventListener('scroll', reveal);
    setTimeout(reveal, 100);
});
// Listen for the custom event dispatched by components.js when the nav renders
document.addEventListener('site-nav-ready', () => {
    // Target the inner <nav> created by the SiteNav component
    const navBar = document.querySelector('site-nav nav');
    
    if (!navBar) return;

    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Use > 50 to prevent hiding when bouncing at the absolute top of the page
        if (currentScroll > lastScrollTop && currentScroll > 50) {
            // User is scrolling down - hide the navbar using Tailwind's translate utility
            navBar.classList.add('-translate-y-full');
        } else {
            // User is scrolling up - show the navbar
            navBar.classList.remove('-translate-y-full');
        }
        lastScrollTop = Math.max(0, currentScroll);
    });
});