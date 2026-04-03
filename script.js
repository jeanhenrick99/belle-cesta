document.addEventListener('DOMContentLoaded', () => {
    const btnExplore = document.getElementById('btnExplore');
    const catalogSection = document.getElementById('colecao');

    // Scroll suave
    if (btnExplore) {
        btnExplore.addEventListener('click', () => {
            catalogSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Efeito de revelação (Fade-in)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.kit-card, .step-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});