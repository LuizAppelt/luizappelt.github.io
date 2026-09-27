// ── TEXTURA DE FUNDO (CANVAS ESTRELADO SUAVE) ────────────────
const canvas = document.getElementById('fundo-estrelado');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    let width = 0;
    let height = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const estrelas = Array.from({ length: 240 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.1 + 0.2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        opacity: Math.random() * 0.5 + 0.15,
        twinkle: Math.random() * Math.PI * 2
    }));

    function animar() {
        requestAnimationFrame(animar);
        ctx.clearRect(0, 0, width, height);
        const t = Date.now() * 0.001;

        for (const e of estrelas) {
            e.x += e.vx;
            e.y += e.vy;
            if (e.x < 0) e.x = width;
            if (e.x > width) e.x = 0;
            if (e.y < 0) e.y = height;
            if (e.y > height) e.y = 0;

            const pulse = e.opacity * (0.75 + 0.25 * Math.sin(t * 1.2 + e.twinkle));
            ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    animar();
}

// ── FADE-IN AO ROLAR A PÁGINA (OTIMIZADO PARA MOBILE) ─────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── ANO DINÂMICO NO FOOTER ───────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ── EMAILJS — CONFIGURAÇÃO ───────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_keo7it8';
const EMAILJS_TEMPLATE_ID = 'template_bd77jlo';
const EMAILJS_PUBLIC_KEY  = 'n21Avd0zZmrraWB3I';

// ── FORMULÁRIO DE CONTATO COM VALIDAÇÃO E ACESSIBILIDADE ─────
const contatoForm = document.getElementById('contato-form');
if (contatoForm) {
    contatoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarEmail();
    });
}

async function enviarEmail() {
    const nomeEl     = document.getElementById('nome');
    const emailEl    = document.getElementById('email');
    const assuntoEl  = document.getElementById('assunto');
    const mensagemEl = document.getElementById('mensagem');
    const feedback   = document.getElementById('form-feedback');
    const btn        = document.getElementById('enviar-btn');
    const btnTexto   = document.getElementById('btn-texto');

    const nome     = nomeEl ? nomeEl.value.trim() : '';
    const email    = emailEl ? emailEl.value.trim() : '';
    const assunto  = assuntoEl ? assuntoEl.value.trim() : '';
    const mensagem = mensagemEl ? mensagemEl.value.trim() : '';

    // Validação
    if (!nome || !email || !mensagem) {
        feedback.textContent = '⚠ Por favor, preencha seu nome, e-mail e mensagem.';
        feedback.className = 'form-feedback erro';
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        feedback.textContent = '⚠ Por favor, informe um endereço de e-mail válido.';
        feedback.className = 'form-feedback erro';
        return;
    }

    // Estado de carregamento
    btn.disabled = true;
    btnTexto.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> &nbsp;Enviando...';
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    // Parâmetros do template EmailJS
    const templateParams = {
        name:     nome,
        email:    email,
        assunto:  assunto || 'Contato via portfólio',
        mensagem: mensagem
    };

    try {
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        // Sucesso
        btnTexto.innerHTML = '<i class="fas fa-check"></i> &nbsp;Enviado!';
        feedback.textContent = '✓ Mensagem enviada com sucesso! Responderei em breve.';
        feedback.className = 'form-feedback sucesso';

        // Limpa os campos
        if (contatoForm) contatoForm.reset();

        // Restaura o botão após 4s
        setTimeout(() => {
            btn.disabled = false;
            btnTexto.innerHTML = '<i class="fas fa-paper-plane"></i> &nbsp;Enviar mensagem';
            feedback.textContent = '';
            feedback.className = 'form-feedback';
        }, 4000);

    } catch (error) {
        btn.disabled = false;
        btnTexto.innerHTML = '<i class="fas fa-paper-plane"></i> &nbsp;Enviar mensagem';
        feedback.textContent = '✗ Não foi possível enviar no momento. Tente novamente ou use o e-mail direto.';
        feedback.className = 'form-feedback erro';
        console.error('EmailJS error:', error);
    }
}
