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

// ── GERENCIADOR DE TEMA (CLARO / ESCURO) ─────────────────────
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon      = document.getElementById('theme-icon');

function aplicarTema(tema) {
    if (tema === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    }
}

// Inicialização baseada no localStorage
const temaSalvo = localStorage.getItem('theme');
if (temaSalvo) {
    aplicarTema(temaSalvo);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const temaAtual = document.documentElement.getAttribute('data-theme');
        const novoTema = temaAtual === 'light' ? 'dark' : 'light';
        aplicarTema(novoTema);
        localStorage.setItem('theme', novoTema);
    });
}

// ── ANO DINÂMICO NO FOOTER ───────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ── BOTÃO DE COPIAR E-MAIL COM FEEDBACK TÁTIL ───────────────
const copyEmailBtn = document.getElementById('copy-email-btn');
const copyTooltip  = document.getElementById('copy-tooltip');

if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
        const email = 'appelt.dev@gmail.com';
        try {
            await navigator.clipboard.writeText(email);
            copyEmailBtn.classList.add('copied');
            if (copyTooltip) copyTooltip.textContent = 'Copiado! ✓';
            setTimeout(() => {
                copyEmailBtn.classList.remove('copied');
                if (copyTooltip) copyTooltip.textContent = 'Copiar';
            }, 2500);
        } catch (err) {
            // Fallback caso clipboard API falhe
            const temp = document.createElement('input');
            temp.value = email;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            copyEmailBtn.classList.add('copied');
            if (copyTooltip) copyTooltip.textContent = 'Copiado! ✓';
            setTimeout(() => {
                copyEmailBtn.classList.remove('copied');
                if (copyTooltip) copyTooltip.textContent = 'Copiar';
            }, 2500);
        }
    });
}

// ── CONTADOR DE CARACTERES DA MENSAGEM ───────────────────────
const mensagemInput = document.getElementById('mensagem');
const charCountEl   = document.getElementById('char-count');

if (mensagemInput && charCountEl) {
    mensagemInput.addEventListener('input', () => {
        const len = mensagemInput.value.length;
        charCountEl.textContent = `${len} / 1000`;
        if (len >= 950) {
            charCountEl.style.color = '#f87171';
        } else {
            charCountEl.style.color = '';
        }
    });
}

// ── MÁSCARA E VALIDAÇÃO DE CELULAR / WHATSAPP ────────────────
const telefoneInput = document.getElementById('telefone');
const telefoneHint  = document.getElementById('telefone-hint');

function formatarTelefone(valor) {
    let v = valor.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 10) {
        return v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length > 6) {
        return v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (v.length > 2) {
        return v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (v.length > 0) {
        return v.replace(/^(\d{0,2})$/, '($1');
    }
    return '';
}

function validarTelefone(mostrarErro) {
    if (!telefoneInput) return false;
    const digitos = telefoneInput.value.replace(/\D/g, '');
    if (!digitos) {
        if (mostrarErro) {
            telefoneInput.classList.add('is-invalid');
            telefoneInput.classList.remove('is-valid');
            if (telefoneHint) {
                telefoneHint.textContent = '⚠ Celular com DDD é obrigatório.';
                telefoneHint.className = 'field-hint active';
            }
        }
        return false;
    }
    if (digitos.length < 10) {
        if (mostrarErro) {
            telefoneInput.classList.add('is-invalid');
            telefoneInput.classList.remove('is-valid');
            if (telefoneHint) {
                telefoneHint.textContent = '⚠ Informe o número com DDD (mínimo 10 dígitos).';
                telefoneHint.className = 'field-hint active';
            }
        }
        return false;
    }
    telefoneInput.classList.remove('is-invalid');
    telefoneInput.classList.add('is-valid');
    if (telefoneHint) {
        telefoneHint.textContent = '';
        telefoneHint.className = 'field-hint';
    }
    return true;
}

if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
        e.target.value = formatarTelefone(e.target.value);
        if (telefoneInput.classList.contains('is-invalid')) {
            validarTelefone(false);
        }
    });

    telefoneInput.addEventListener('blur', () => {
        validarTelefone(true);
    });
}

// ── MOTOR AVANÇADO DE VALIDAÇÃO DE E-MAIL REAL ───────────────
const emailInput = document.getElementById('email');
const emailHint  = document.getElementById('email-hint');

// Provedores temporários/descartáveis comuns
const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'throwawaymail.com', 'sharklasers.com', 'yopmail.com', 'trashmail.com',
    'dispostable.com', 'fakemailgenerator.com', 'temp-mail.org', 'getairmail.com',
    'mohmal.com', 'crazymailing.com', 'mailcatch.com', 'nada.ltd', 'inboxkitten.com'
]);

// Erros de digitação frequentes
const TYPO_MAP = {
    'gmai.com': 'gmail.com', 'gmial.com': 'gmail.com', 'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gmeil.com': 'gmail.com',
    'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotamil.com': 'hotmail.com',
    'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com', 'outlock.com': 'outlook.com',
    'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yaho.com.br': 'yahoo.com.br'
};

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Verificação de registros MX via Cloudflare DNS-over-HTTPS (DoH)
async function checarDominioMX(dominio) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(dominio)}&type=MX`, {
            headers: { 'Accept': 'application/dns-json' },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!res.ok) return { valido: true };
        const data = await res.json();

        // Status 3 = NXDOMAIN (domínio não existe na internet)
        if (data.Status === 3) {
            return { valido: false, motivo: 'O domínio deste e-mail não existe na internet.' };
        }

        // Sem registros MX e sem respostas válidas
        const hasMX = data.Answer && data.Answer.some(r => r.type === 15);
        if (!hasMX && (!data.Answer || data.Answer.length === 0)) {
            return { valido: false, motivo: 'Este domínio não possui servidores configurados para receber e-mails.' };
        }

        return { valido: true };
    } catch (e) {
        // Fail-open: se DoH for bloqueado por adblocker ou rede, não trava o usuário
        return { valido: true };
    }
}

async function validarEmail(mostrarErro, checarDNS = false) {
    if (!emailInput) return false;
    const valor = emailInput.value.trim().toLowerCase();

    if (!valor) {
        if (mostrarErro) {
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
            if (emailHint) {
                emailHint.textContent = '⚠ E-mail é obrigatório.';
                emailHint.className = 'field-hint active';
            }
        }
        return false;
    }

    if (!EMAIL_REGEX.test(valor)) {
        if (mostrarErro) {
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
            if (emailHint) {
                emailHint.textContent = '⚠ Formato de e-mail inválido (ex: nome@dominio.com).';
                emailHint.className = 'field-hint active';
            }
        }
        return false;
    }

    const partes = valor.split('@');
    const dominio = partes[1];

    if (DISPOSABLE_DOMAINS.has(dominio)) {
        if (mostrarErro) {
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
            if (emailHint) {
                emailHint.textContent = '⚠ E-mails temporários/descartáveis não são aceitos.';
                emailHint.className = 'field-hint active';
            }
        }
        return false;
    }

    // Sugestão de digitação comum
    if (TYPO_MAP[dominio]) {
        const sugerido = `${partes[0]}@${TYPO_MAP[dominio]}`;
        if (mostrarErro && emailHint) {
            emailHint.innerHTML = `💡 Você quis dizer <span class="suggestion-link">${sugerido}</span>?`;
            emailHint.className = 'field-hint active suggestion-hint';
            const linkSugestao = emailHint.querySelector('.suggestion-link');
            if (linkSugestao) {
                linkSugestao.onclick = () => {
                    emailInput.value = sugerido;
                    validarEmail(true, true);
                };
            }
        }
    }

    if (checarDNS) {
        const mxResult = await checarDominioMX(dominio);
        if (!mxResult.valido) {
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
            if (emailHint) {
                emailHint.textContent = `⚠ ${mxResult.motivo}`;
                emailHint.className = 'field-hint active';
            }
            return false;
        }
    }

    emailInput.classList.remove('is-invalid');
    emailInput.classList.add('is-valid');
    if (emailHint && !emailHint.classList.contains('suggestion-hint')) {
        emailHint.textContent = '';
        emailHint.className = 'field-hint';
    }
    return true;
}

if (emailInput) {
    emailInput.addEventListener('blur', () => {
        validarEmail(true, true);
    });
    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('is-invalid')) {
            validarEmail(false, false);
        }
    });
}

// ── EMAILJS — CONFIGURAÇÃO ───────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_keo7it8';
const EMAILJS_TEMPLATE_ID = 'template_bd77jlo';
const EMAILJS_PUBLIC_KEY  = 'n21Avd0zZmrraWB3I';

// ── FORMULÁRIO DE CONTATO COM VALIDAÇÃO E ENVIO ──────────────
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
    const telEl      = document.getElementById('telefone');
    const assuntoEl  = document.getElementById('assunto');
    const mensagemEl = document.getElementById('mensagem');
    const feedback   = document.getElementById('form-feedback');
    const btn        = document.getElementById('enviar-btn');
    const btnTexto   = document.getElementById('btn-texto');
    const honeypot   = document.getElementById('honeypot');

    // 1. Verificação Honeypot Anti-Spam
    if (honeypot && honeypot.value) {
        console.warn('Spam detectado e bloqueado via honeypot.');
        feedback.textContent = '✓ Mensagem enviada com sucesso!';
        feedback.className = 'form-feedback sucesso';
        return;
    }

    const nome     = nomeEl ? nomeEl.value.trim() : '';
    const email    = emailEl ? emailEl.value.trim() : '';
    const telefone = telEl ? telEl.value.trim() : '';
    const assunto  = assuntoEl ? assuntoEl.value.trim() : '';
    const mensagem = mensagemEl ? mensagemEl.value.trim() : '';

    let temErro = false;

    // Validação de Nome
    const nomeHint = document.getElementById('nome-hint');
    if (!nome) {
        nomeEl.classList.add('is-invalid');
        if (nomeHint) {
            nomeHint.textContent = '⚠ Por favor, informe seu nome.';
            nomeHint.className = 'field-hint active';
        }
        temErro = true;
    } else {
        nomeEl.classList.remove('is-invalid');
        nomeEl.classList.add('is-valid');
        if (nomeHint) nomeHint.className = 'field-hint';
    }

    // Validação de E-mail (com checagem DNS)
    const emailValido = await validarEmail(true, true);
    if (!emailValido) temErro = true;

    // Validação de Celular
    const telValido = validarTelefone(true);
    if (!telValido) temErro = true;

    // Validação de Mensagem
    const msgHint = document.getElementById('mensagem-hint');
    if (!mensagem) {
        mensagemEl.classList.add('is-invalid');
        if (msgHint) {
            msgHint.textContent = '⚠ Por favor, escreva sua mensagem.';
            msgHint.className = 'field-hint active';
        }
        temErro = true;
    } else {
        mensagemEl.classList.remove('is-invalid');
        mensagemEl.classList.add('is-valid');
        if (msgHint) msgHint.className = 'field-hint';
    }

    if (temErro) {
        feedback.textContent = '⚠ Corrija os campos obrigatórios destacados acima.';
        feedback.className = 'form-feedback erro';
        return;
    }

    // Estado de carregamento
    btn.disabled = true;
    btnTexto.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> &nbsp;Validando e enviando...';
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    // Garante que o celular chegue no e-mail mesmo sem editar o template no painel EmailJS
    const mensagemComContato = `[Celular/WhatsApp para contato: ${telefone}]\n\n${mensagem}`;

    const templateParams = {
        name:     nome,
        email:    email,
        telefone: telefone,
        assunto:  assunto || 'Contato via portfólio',
        mensagem: mensagemComContato
    };

    try {
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        btnTexto.innerHTML = '<i class="fas fa-check"></i> &nbsp;Enviado!';
        feedback.textContent = '✓ Mensagem enviada com sucesso! Responderei no seu e-mail ou WhatsApp em breve.';
        feedback.className = 'form-feedback sucesso';

        if (contatoForm) contatoForm.reset();
        document.querySelectorAll('.form-input').forEach(el => el.classList.remove('is-valid'));
        if (charCountEl) charCountEl.textContent = '0 / 1000';

        setTimeout(() => {
            btn.disabled = false;
            btnTexto.innerHTML = '<i class="fas fa-paper-plane"></i> &nbsp;Enviar mensagem';
            feedback.textContent = '';
            feedback.className = 'form-feedback';
        }, 5000);

    } catch (error) {
        btn.disabled = false;
        btnTexto.innerHTML = '<i class="fas fa-paper-plane"></i> &nbsp;Enviar mensagem';
        feedback.textContent = '✗ Falha no envio. Tente novamente ou use o e-mail/LinkedIn direto ao lado.';
        feedback.className = 'form-feedback erro';
        console.error('EmailJS error:', error);
    }
}
