function init() {

  /* ── Mobile menu ── */
  const toggle    = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const iconOpen  = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (!toggle || !mobileNav) return;

  const openMobile = () => {
    mobileNav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    if (iconOpen)  iconOpen.style.display  = 'none';
    if (iconClose) iconClose.style.display = '';
  };

  const closeMobile = () => {
    mobileNav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    if (iconOpen)  iconOpen.style.display  = '';
    if (iconClose) iconClose.style.display = 'none';
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileNav.classList.contains('open') ? closeMobile() : openMobile();
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobile);
  });

  document.addEventListener('click', (e) => {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !toggle.contains(e.target)
    ) closeMobile();
  }, { passive: true });


  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item     = btn.closest('.faq-item');
      const isOpen   = item.classList.contains('open');

      // Fechar todos
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Abrir o clicado (se estava fechado)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 72,
        behavior: 'smooth'
      });
    });
  });

  /* ── Footer year ── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Contact form: Web3Forms + WhatsApp ── */
  const form         = document.getElementById('contact-form');
  const successState = document.getElementById('success-state');
  const errorBanner  = document.getElementById('error-banner');

  if (form) {
    const submitBtn    = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;

    const setLoading = (on) => {
      submitBtn.disabled  = on;
      submitBtn.innerHTML = on ? '<span class="btn-spinner"></span> Enviando…' : originalHTML;
    };

    const showSuccess = () => requestAnimationFrame(() => {
      form.style.display = 'none';
      errorBanner?.classList.remove('visible');
      if (successState) successState.style.display = 'flex';
    });

    const showError = () => requestAnimationFrame(() => {
      errorBanner?.classList.add('visible');
      errorBanner?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome     = form.elements['nome'].value.trim();
      const telefone = form.elements['telefone'].value.trim();
      const email    = form.elements['email'].value.trim();
      const mensagem = form.elements['mensagem'].value.trim();
      if (!nome || !telefone || !email || !mensagem) return;

      errorBanner?.classList.remove('visible');
      setLoading(true);

      const formData = new FormData(form);
      formData.set('Telefone', telefone);
      formData.set('Nome', nome);
      formData.set('Mensagem', mensagem);

      try {
        const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
          const text = encodeURIComponent(
            `Olá! Meu nome é ${nome}.\n\nTelefone: ${telefone}\nE-mail: ${email}\n\nMensagem: ${mensagem}`
          );
          window.open(`https://wa.me/5585988821108?text=${text}`, '_blank');
          showSuccess();
          form.reset();
        } else {
          showError();
        }
      } catch {
        setLoading(false);
        showError();
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
