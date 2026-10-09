document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    
    const mainLogo = document.getElementById('main-logo');
    const footerLogo = document.getElementById('footer-logo');

    const updateLogos = (isDark) => {
        // logo/1.png is for dark theme, logo/2.png is for light theme.
        const logoSrc = isDark ? 'logo/1.png' : 'logo/2.png';
        if (mainLogo) mainLogo.src = logoSrc;
        if (footerLogo) footerLogo.src = logoSrc;
    };

    // Check initial preference from localStorage or OS settings
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
        updateLogos(true);
    } else {
        document.documentElement.classList.remove('dark');
        if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
        updateLogos(false);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            // Toggle icons
            themeToggleDarkIcon.classList.toggle('hidden');
            themeToggleLightIcon.classList.toggle('hidden');

            // Toggle and save theme
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
                updateLogos(false);
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
                updateLogos(true);
            }
        });
    }

    // Mobile Menu Toggle Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Scroll Animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => scrollObserver.observe(el));
});

    // Analytics/Tracking Logic for Buttons
    const trackClick = (buttonId) => {
        // Envia de forma assíncrona o evento de clique para o backend
        fetch('/api/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ button: buttonId })
        }).catch(err => console.error('Erro ao registrar clique:', err));
    };

    // Associa o rastreio aos botões que direcionam para o site principal
    const trackedLinks = document.querySelectorAll('a[href="https://zum.beezes.com.br"]');
    trackedLinks.forEach(btn => {
        btn.addEventListener('click', function() {
            // Identifica qual botão foi clicado através do texto
            const text = this.innerText.toLowerCase();
            if (text.includes('baixar app')) {
                trackClick('baixar_app');
            } else if (text.includes('eu quero')) {
                trackClick('eu_quero');
            } else {
                trackClick('outro');
            }
        });
    });
