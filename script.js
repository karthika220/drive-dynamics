/* ─────────────────────────────────────────
   Drive Dynamix — script.js
   Handles: Hamburger, FAQ accordion,
            Form submission, Image fallbacks
───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. HAMBURGER MENU ─── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on nav-link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ─── 2. FAQ ACCORDION ─── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';
      const answer   = btn.nextElementSibling;
      const icon     = btn.querySelector('.faq-icon');

      // Close all others
      document.querySelectorAll('.faq-question').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherAnswer = other.nextElementSibling;
          const otherIcon   = other.querySelector('.faq-icon');
          if (otherAnswer) otherAnswer.classList.remove('open');
          if (otherIcon)   otherIcon.textContent = '+';
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', !isOpen);
      answer.classList.toggle('open', !isOpen);
      icon.textContent = isOpen ? '+' : '×';
    });
  });


  /* ─── 3. FORM SUBMISSIONS ─── */
  function handleFormSubmit(btn) {
    btn.addEventListener('click', () => {
      const wrap  = btn.closest('.lead-form');
      const name  = wrap.querySelector('input[type="text"]').value.trim();
      const phone = wrap.querySelector('input[type="tel"]').value.trim();
      const email = wrap.querySelector('input[type="email"]').value.trim();
      const prod  = wrap.querySelector('select').value;

      if (!name || !phone || !email || !prod) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
        showToast('Please enter a valid 10-digit phone number.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      // Success — here you'd POST to your backend / CRM
      showToast('Thank you! We will contact you shortly.', 'success');
      wrap.querySelectorAll('input').forEach(i => i.value = '');
      wrap.querySelector('select').value = '';
    });
  }

  document.querySelectorAll('.btn-submit').forEach(handleFormSubmit);


  /* ─── 4. TOAST NOTIFICATION ─── */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.dd-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'dd-toast dd-toast--' + type;
    toast.textContent = message;

    const style = document.createElement('style');
    if (!document.querySelector('#dd-toast-style')) {
      style.id = 'dd-toast-style';
      style.textContent = `
        .dd-toast {
          position: fixed;
          bottom: 90px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          padding: 14px 28px;
          border-radius: 4px;
          font-family: 'Barlow', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.3s, transform 0.3s;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        .dd-toast--success { background: #1e7e34; color: #fff; }
        .dd-toast--error   { background: #E31E24; color: #fff; }
        .dd-toast.visible  { opacity: 1; transform: translateX(-50%) translateY(0); }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('visible'));
    });
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }


  /* ─── 5. IMAGE FALLBACKS ─── */
  // When a product/feature image fails to load, show the placeholder text
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });

    // If image loads successfully, hide sibling placeholder
    img.addEventListener('load', () => {
      const ph = img.nextElementSibling;
      if (ph && (ph.classList.contains('product-img-ph') ||
                 ph.classList.contains('feature-img-placeholder') ||
                 ph.classList.contains('hero-img-placeholder') ||
                 ph.classList.contains('banner-img-ph'))) {
        ph.style.display = 'none';
      }
    });
  });


  /* ─── 6. NAVBAR SCROLL SHADOW ─── */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
    } else {
      navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    }
  }, { passive: true });


  /* ─── 7. SMOOTH ACTIVE NAV LINKS ─── */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.fontWeight = '';
        });
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.style.color = '#E31E24';
          activeLink.style.fontWeight = '600';
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => observer.observe(sec));

});
