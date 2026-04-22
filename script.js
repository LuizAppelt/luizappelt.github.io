// ── STARFIELD ────────────────────────────────────────────────
const canvas = document.getElementById('fundo-estrelado');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const estrelas = Array.from({ length: 347 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    opacity: Math.random() * 0.6 + 0.2,
    twinkle: Math.random() * Math.PI * 2
}));

function animar() {
    requestAnimationFrame(animar);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;

    for (const e of estrelas) {
        e.x += e.vx;
        e.y += e.vy;
        if (e.x < 0) e.x = canvas.width;
        if (e.x > canvas.width) e.x = 0;
        if (e.y < 0) e.y = canvas.height;
        if (e.y > canvas.height) e.y = 0;

        const pulse = e.opacity * (0.7 + 0.3 * Math.sin(t * 1.5 + e.twinkle));
        ctx.fillStyle = `rgba(255,255,255,${pulse})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
    }
}
animar();

// ── FADE-IN AO ROLAR A PÁGINA ────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.3 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── ANO DINÂMICO NO FOOTER ───────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── EMAILJS — CONFIGURAÇÃO ───────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_keo7it8';
const EMAILJS_TEMPLATE_ID = 'template_bd77jlo';
const EMAILJS_PUBLIC_KEY  = 'n21Avd0zZmrraWB3I';

// ── FORMULÁRIO DE CONTATO ────────────────────────────────────
async function enviarEmail() {
    const nome     = document.getElementById('nome').value.trim();
    const email    = document.getElementById('email').value.trim();
    const assunto  = document.getElementById('assunto').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    const feedback = document.getElementById('form-feedback');
    const btn      = document.getElementById('enviar-btn');
    const btnTexto = document.getElementById('btn-texto');

    // Validação
    if (!nome || !email || !mensagem) {
        feedback.textContent = '⚠ Preencha nome, e-mail e mensagem.';
        feedback.className = 'form-feedback erro';
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        feedback.textContent = '⚠ E-mail inválido.';
        feedback.className = 'form-feedback erro';
        return;
    }

    // Estado de carregamento
    btn.disabled = true;
    btnTexto.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> &nbsp;Enviando...';
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    // Parâmetros — nomes exatos das variáveis do template EmailJS
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

        // Limpa o formulário
        document.getElementById('nome').value     = '';
        document.getElementById('email').value    = '';
        document.getElementById('assunto').value  = '';
        document.getElementById('mensagem').value = '';

        // Restaura botão após 4s
        setTimeout(() => {
            btn.disabled = false;
            btnTexto.innerHTML = '<i class="fas fa-paper-plane"></i> &nbsp;Enviar mensagem';
            feedback.textContent = '';
            feedback.className = 'form-feedback';
        }, 4000);

    } catch (error) {
        btn.disabled = false;
        btnTexto.innerHTML = '<i class="fas fa-paper-plane"></i> &nbsp;Enviar mensagem';
        feedback.textContent = '✗ Erro ao enviar. Tente novamente ou me contate diretamente.';
        feedback.className = 'form-feedback erro';
        console.error('EmailJS error:', error);
    }
}
