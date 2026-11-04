/* ==========================================================================
   ADVENTURE CORBETT SAFARI - GLOBAL JAVASCRIPT (assets/script.js)
   Fixed: Safe Active Nav, Resilient Slider & FormSubmit AJAX Handler
   ========================================================================== */

// Reports a Google Ads conversion only after an enquiry was actually submitted.
function acsReportConversion() {
  if (typeof gtag === 'function') {
    gtag('event', 'conversion', {
      send_to: 'AW-18551133495/cM0RCI-6rrAdELeq741F',
      value: 1.0,
      currency: 'INR'
    });
  }
}

const SITE_CONFIG = {
  email: 'adventuresafari120@gmail.com',
  phone: '+91-9520645743',
  whatsappPhone: '919520645743',
  slideIntervalMs: 5000
};

document.addEventListener('DOMContentLoaded', () => {

  // 1. Robust Active Nav Highlighting
  const nav = document.querySelector('.nav-links');
  if (nav) {
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const cleanPath = rawPath.split('?')[0].split('#')[0] || 'index.html';
    const navAnchors = nav.querySelectorAll('a');

    navAnchors.forEach(link => {
      const href = link.getAttribute('href');
      if (href === cleanPath || (cleanPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // 2. Mobile Menu Toggle
  const toggle = document.querySelector('.menu-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.textContent = isOpen ? '✕' : '☰';
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
  }

  // 3. Resilient Hero Slider
  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.hero-dots button')];

  if (slides.length > 0 && dots.length > 0) {
    let currentIndex = 0;
    let timerId = null;

    const showSlide = (nextIndex) => {
      currentIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, idx) => slide.classList.toggle('active', idx === currentIndex));
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentIndex));
    };

    const startAutoSlide = () => {
      if (timerId) clearInterval(timerId);
      timerId = setInterval(() => showSlide(currentIndex + 1), SITE_CONFIG.slideIntervalMs);
    };

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startAutoSlide();
      });
    });

    startAutoSlide();
  }

  // 4. FormSubmit.co Lead Handler (Direct AJAX Submission)
  document.querySelectorAll('[data-enquiry-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const feedback = form.parentElement.querySelector('.form-feedback');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Enquiry';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Details...';
      }

      const formData = new FormData(form);
      const dataObj = Object.fromEntries(formData.entries());
      
      dataObj['_subject'] = `Corbett Safari Booking: ${dataObj.interest || 'Trip Enquiry'} - ${dataObj.name || ''}`;
      dataObj['_template'] = 'table';
      dataObj['_captcha'] = 'false';

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${SITE_CONFIG.email}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(dataObj)
        });

        if (response.ok) {
          form.reset();
          acsReportConversion();
          if (feedback) {
            feedback.innerHTML = `✅ <strong>Thank you, ${dataObj.name || 'Traveller'}!</strong> Your enquiry has been received by our local travel desk. We will contact you on <strong>${dataObj.phone}</strong> shortly.`;
            feedback.style.display = 'block';
            feedback.style.background = 'rgba(37, 211, 102, 0.2)';
            feedback.style.border = '1px solid #25d366';
            feedback.style.color = '#0b421d';
          }
        } else {
          throw new Error('FormSubmit unverified or offline');
        }
      } catch (err) {
        // Safe Fallback to WhatsApp chat if endpoint fails
        if (feedback) {
          const waMsg = encodeURIComponent(`Hello, my name is ${dataObj.name}. I want to enquire about ${dataObj.interest}. Phone: ${dataObj.phone}`);
          feedback.innerHTML = `⚠️ We could not submit the form. To connect instantly, please use: <a href="https://wa.me/${SITE_CONFIG.whatsappPhone}?text=${waMsg}" target="_blank" style="text-decoration:underline; font-weight:bold; color:#0b421d;">WhatsApp us →</a>`;
          feedback.style.display = 'block';
          feedback.style.background = '#fff3cd';
          feedback.style.border = '1px solid #ffeeba';
          feedback.style.color = '#856404';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });

  // 5. WhatsApp Floating Button (Safe Injection)
  if (!document.querySelector('.whatsapp-floating-btn')) {
    const waLink = document.createElement('a');
    waLink.className = 'whatsapp-floating-btn';
    const waMessage = encodeURIComponent('Hello Adventure Corbett Safari, I want to enquire about Jim Corbett safari and stays.');
    waLink.href = `https://wa.me/${SITE_CONFIG.whatsappPhone}?text=${waMessage}`;
    waLink.target = '_blank';
    waLink.rel = 'noopener noreferrer';
    waLink.setAttribute('aria-label', 'Chat with Adventure Corbett Safari on WhatsApp');
    waLink.innerHTML = `
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M16 2C8.28 2 2 8.28 2 16c0 2.62.72 5.16 2.08 7.38L2.05 30l6.83-1.99C11.02 29.29 13.48 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.64c-2.27 0-4.49-.62-6.42-1.79l-.46-.28-4.76 1.39 1.4-4.63-.3-.48C4.24 19.9 3.56 17.98 3.56 16c0-6.86 5.58-12.44 12.44-12.44s12.44 5.58 12.44 12.44-5.58 12.44-12.44 12.44zm6.84-9.33c-.38-.19-2.24-1.11-2.59-1.23-.35-.13-.6-.19-.85.19-.25.38-.98 1.23-1.2 1.48-.22.25-.45.28-.82.1-.38-.19-1.59-.59-3.03-1.87-1.12-1-1.88-2.24-2.1-2.62-.22-.38-.02-.58.17-.77.17-.17.38-.45.56-.67.19-.22.25-.38.38-.63.13-.25.06-.48-.03-.67-.1-.19-.85-2.05-1.17-2.81-.31-.74-.63-.64-.85-.65-.22-.01-.48-.01-.73-.01s-.67.1-.98.45c-.38.38-1.46 1.43-1.46 3.48s1.5 4.04 1.71 4.32c.22.28 2.95 4.5 7.15 6.32 1 .43 1.78.69 2.39.88 1.01.32 1.93.28 2.66.17.81-.12 2.24-.92 2.56-1.8.31-.89.31-1.64.22-1.8-.09-.16-.34-.25-.72-.44z"/>
      </svg>
      <span>Chat on WhatsApp</span>
    `;
    document.body.appendChild(waLink);
  }

});

// Ensure every enquiry form note links to the Privacy Policy.
document.querySelectorAll('.form-note').forEach((note) => {
  if (!note.querySelector('a[href*="privacy-policy"]')) {
    note.insertAdjacentHTML('beforeend', ' <a href="privacy-policy.html" style="text-decoration:underline">Privacy Policy</a>');
  }
});
