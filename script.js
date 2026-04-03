document.addEventListener('DOMContentLoaded', () => {

    // Configuração dos itens por Kit
    const kitsConfig = {
        "Kit Miminho": ["Chocolate", "Caneca", "Biscoito Importado"],
        "Kit Carinho": ["Chocolate", "Caneca", "Vinho", "Geleia Importada", "Torrada"],
        "Kit Belle": ["Espumantes", "Chocolate", "Geleia Importada", "Torrada", "Ursinho de Pelúcia", "Caneca"]
    };

    const itensBase = {
        "Chocolate": ["Ferrero Rocher", "Lindt Ao Leite", "Milka Hazelnut"],
        "Caneca": ["Cerâmica Branca", "Personalizada Ouro", "Xícara de Chá"],
        "Vinho": ["Tinto Chileno", "Rosé Suave", "Branco Seco"],
        "Espumantes": ["Chandon Baby", "Brut Premium"],
        "Biscoito Importado": ["Amanteigado Holandês", "Waffer Italiano"],
        "Geleia Importada": ["Morango St. Dalfour", "Damasco Francesa"],
        "Torrada": ["Multigrãos", "Tradicional"],
        "Ursinho de Pelúcia": ["Urso Clássico Bege", "Urso Marrom Pequeno"]
    };

    let currentKit = "";
    let currentStep = 0;
    let userChoices = {};
    let stepsList = [];

    const modal = document.getElementById('customizer-modal');
    const optionsGrid = document.getElementById('options-grid');
    const btnNext = document.getElementById('nextStep');
    const btnPrev = document.getElementById('prevStep');

    // Scroll suave ao catálogo
    const btnExplore = document.getElementById('btnExplore');
    if (btnExplore) {
        btnExplore.addEventListener('click', () => {
            document.getElementById('colecao').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Abrir modal ao clicar em "Personalizar e Pedir"
    document.querySelectorAll('.open-customizer').forEach(btn => {
        btn.addEventListener('click', () => {
            currentKit = btn.closest('.kit-card').dataset.kit;
            stepsList = kitsConfig[currentKit];
            currentStep = 0;
            userChoices = {};
            modal.classList.add('active');
            renderStep();
        });
    });

    // Fechar modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.classList.remove('active');
    }

    // Renderiza o passo atual
    function renderStep() {
        const category = stepsList[currentStep];
        const total = stepsList.length;

        document.getElementById('modal-kit-title').innerText = currentKit;
        document.getElementById('step-question').innerText = `Escolha seu ${category}`;
        document.getElementById('step-current').innerText = currentStep + 1;
        document.getElementById('step-total').innerText = total;

        // Dots de progresso
        const dotsContainer = document.getElementById('step-dots');
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === currentStep ? ' dot-active' : (i < currentStep ? ' dot-done' : ''));
            dotsContainer.appendChild(dot);
        }

        // Opções de seleção
        optionsGrid.innerHTML = '';
        const options = itensBase[category] || [];

        options.forEach(item => {
            const div = document.createElement('div');
            const isSelected = userChoices[category] === item;
            div.className = `option-card${isSelected ? ' selected' : ''}`;
            div.innerHTML = `
                <span class="option-check">${isSelected ? '✓' : ''}</span>
                <span class="option-label">${item}</span>
            `;
            div.addEventListener('click', () => {
                // Desseleciona todos, seleciona o clicado
                document.querySelectorAll('.option-card').forEach(c => {
                    c.classList.remove('selected');
                    c.querySelector('.option-check').innerText = '';
                });
                div.classList.add('selected');
                div.querySelector('.option-check').innerText = '✓';
                userChoices[category] = item;
                updateNextBtn();
            });
            optionsGrid.appendChild(div);
        });

        // Navegação
        btnPrev.disabled = currentStep === 0;

        updateNextBtn();
    }

    function updateNextBtn() {
        const category = stepsList[currentStep];
        const isLast = currentStep === stepsList.length - 1;
        const hasChoice = !!userChoices[category];

        btnNext.innerText = isLast ? '✦ Finalizar Pedido' : 'Próximo →';
        btnNext.classList.toggle('btn-ready', hasChoice);
    }

    // Próximo passo
    btnNext.addEventListener('click', () => {
        const category = stepsList[currentStep];
        if (!userChoices[category]) {
            // Shake visual na grid ao invés de alert
            optionsGrid.classList.add('shake');
            setTimeout(() => optionsGrid.classList.remove('shake'), 500);
            return;
        }
        if (currentStep < stepsList.length - 1) {
            currentStep++;
            renderStep();
        } else {
            sendWhatsApp();
        }
    });

    // Passo anterior
    btnPrev.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderStep();
        }
    });

    // Envio via WhatsApp
    function sendWhatsApp() {
        let msg = `Olá! Gostaria de pedir o *${currentKit}* personalizado:\n\n`;
        for (let cat in userChoices) {
            msg += `• *${cat}:* ${userChoices[cat]}\n`;
        }
        msg += `\nAguardo as informações para finalizar o pedido. 😊`;
        const url = `https://wa.me/5546999866726?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
        closeModal();
    }

});
