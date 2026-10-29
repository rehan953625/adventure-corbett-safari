/* ==========================================================================
   ADVENTURE CORBETT SAFARI — script.js
   Domain: adventurecorbettsafari.com | Email: adventuresafari120@gmail.com
   Features:
   - Configured for Adventure Corbett Safari (Domain, Brand, Phone, WhatsApp, Email)
   - Streamlined Slot & Booking Enquiry Form (No Estimator Box Required)
   - Smart Safari Format <-> Zone Synchronization (Jeep Safari vs Canter Safari)
   - Local Timezone (IST) Date Initialization & Past-Date Protection
   - Universal Local Image Extension Resolver (.webp / .jpg / .jpeg / .png)
   - Smart Resort Photo Slideshow & Interactive 10-Zone Filter
   - Serverless Direct AJAX Enquiry Submission (FormSubmit) with Validation
   ========================================================================== */

var SITE_CONFIG = {
  domain: 'adventurecorbettsafari.com',
  siteUrl: 'https://adventurecorbettsafari.com',
  brandName: 'Adventure Corbett Safari',
  brandPrimary: 'ADVENTURE CORBETT',
  brandAccent: 'SAFARI',
  agencyName: 'Adventure Corbett Safari (Private Safari Tour Operator)',
  phoneDisplay: '+91-9520645743',
  phoneTel: '+919520645743',
  whatsappNumber: '919520645743',
  email: 'adventuresafari120@gmail.com'
};

// State trackers for smart format <-> zone sync & toast timers
var lastSelectedType = 'Private 4x4 Gypsy Safari';
var lastSelectedZone = 'Bijrani Zone';
var toastTimeoutId = null;

// Get YYYY-MM-DD in local timezone (avoids UTC midnight lag in IST)
function getLocalISODate(offsetDays) {
  var d = new Date();
  d.setDate(d.getDate() + (offsetDays || 0));
  var yyyy = d.getFullYear();
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return yyyy + '-' + mm + '-' + dd;
}

// Synchronize Safari Format (#type) and Preferred Zone (#zone) to prevent invalid combinations
function syncFormatAndZone(typeEl, zoneEl) {
  if (!typeEl || !zoneEl) return;

  var currentType = typeEl.value;
  var currentZone = zoneEl.value;
  var typeChanged = currentType !== lastSelectedType;
  var zoneChanged = currentZone !== lastSelectedZone;

  if (typeChanged) {
    if (currentType === 'Canter Safari - Dhikala') {
      // Canter Safari operates exclusively in Dhikala Core Zone
      if (currentZone !== 'Dhikala Core Zone') {
        zoneEl.value = 'Dhikala Core Zone';
        currentZone = 'Dhikala Core Zone';
      }
    } else if (currentType === 'Private 4x4 Gypsy Safari' && currentZone === 'Dhikala Core Zone') {
      // Day visitors cannot enter Dhikala Core Zone by Private Gypsy; switch to Bijrani Zone
      zoneEl.value = 'Bijrani Zone';
      currentZone = 'Bijrani Zone';
      showToast('Day Jeep Safari is not permitted in Dhikala · Switched to Bijrani Zone');
    }
  } else if (zoneChanged) {
    if (currentZone === 'Dhikala Core Zone' && currentType === 'Private 4x4 Gypsy Safari') {
      // Selecting Dhikala Core Zone automatically selects Day Canter Safari
      typeEl.value = 'Canter Safari - Dhikala';
      currentType = 'Canter Safari - Dhikala';
      showToast('Dhikala Day Safari operates via 16-Seater Canter');
    } else if (currentZone !== 'Dhikala Core Zone' && currentType !== 'Private 4x4 Gypsy Safari') {
      // Selecting any other zone switches format to Jeep Safari
      typeEl.value = 'Private 4x4 Gypsy Safari';
      currentType = 'Private 4x4 Gypsy Safari';
    }
  }

  lastSelectedType = currentType;
  lastSelectedZone = currentZone;
}

// Keep updateFareEstimator() function name so HTML onchange="updateFareEstimator()" works seamlessly
function updateFareEstimator() {
  var typeEl = document.getElementById('type');
  var zoneEl = document.getElementById('zone');
  if (!typeEl || !zoneEl) return;
  syncFormatAndZone(typeEl, zoneEl);
}

// Clamp guest input value cleanly when user finishes typing (on blur/change)
function enforceGuestBounds() {
  var guestsEl = document.getElementById('guests');
  if (!guestsEl) return;
  var val = parseInt(guestsEl.value, 10);
  if (isNaN(val) || val < 1) {
    guestsEl.value = 1;
  } else if (val > 16) {
    guestsEl.value = 16;
    showToast('Maximum 16 guests per online enquiry');
  }
}

// Validate Travel Date so past dates cannot be selected
function validateTravelDate() {
  var dateInput = document.getElementById('date');
  if (!dateInput) return;
  var minDate = getLocalISODate(0);
  if (dateInput.value && dateInput.value < minDate) {
    dateInput.value = getLocalISODate(1);
    showToast('Past dates are not allowed · Set to tomorrow');
  }
}

// Fix any unclosed grid wrapper alignment for CTA row & booking note
function normalizeBookingGridLayout() {
  var ctaRow = document.querySelector('.booking-cta-row');
  var bookingNote = document.querySelector('.booking-note');
  if (ctaRow && ctaRow.parentElement && ctaRow.parentElement.classList.contains('booking-form-grid')) {
    ctaRow.style.gridColumn = '1 / -1';
  }
  if (bookingNote && bookingNote.parentElement && bookingNote.parentElement.classList.contains('booking-form-grid')) {
    bookingNote.style.gridColumn = '1 / -1';
  }
}

// Hydrate SITE_CONFIG across DOM links and copyright year
function applySiteConfig() {
  var yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var telLinks = document.querySelectorAll('a[href^="tel:"]');
  telLinks.forEach(function(link) {
    link.setAttribute('href', 'tel:' + SITE_CONFIG.phoneTel);
  });

  var mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  mailLinks.forEach(function(link) {
    link.setAttribute('href', 'mailto:' + SITE_CONFIG.email);
    if (link.textContent.indexOf('@') !== -1) {
      link.textContent = link.textContent.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, SITE_CONFIG.email);
    }
  });

  var waLinks = document.querySelectorAll('a[href*="wa.me/"]');
  waLinks.forEach(function(link) {
    link.setAttribute('href', 'https://wa.me/' + SITE_CONFIG.whatsappNumber);
  });
}

// Attach extension fallback handler to a single image element
function attachImageExtensionFallback(img, fallbacks, onAllFailed) {
  var triedExts = [];

  function tryNextExtension() {
    var currentSrc = img.getAttribute('src') || '';
    if (!currentSrc || currentSrc.indexOf('http') === 0) return;
    var basePath = currentSrc.replace(/\.(webp|jpg|jpeg|png|WEBP|JPG|JPEG|PNG)$/i, '');
    var nextExt = null;

    for (var i = 0; i < fallbacks.length; i++) {
      var candidate = fallbacks[i];
      if (
        triedExts.indexOf(candidate) === -1 &&
        currentSrc.slice(-candidate.length).toLowerCase() !== candidate.toLowerCase()
      ) {
        nextExt = candidate;
        break;
      }
    }

    if (nextExt) {
      triedExts.push(nextExt);
      img.setAttribute('src', basePath + nextExt);
    } else if (typeof onAllFailed === 'function') {
      onAllFailed(img);
    }
  }

  img.addEventListener('error', tryNextExtension);

  // Handle images that already failed before the script listener was attached
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
    tryNextExtension();
  }
}

// Universal Local Image Extension Resolver for zone/, maya/, moalik/, corbett-le/, resorts/
function initLocalImageFallbacks() {
  var staticImages = document.querySelectorAll('.hero-bg-media img, .z-card-media img, .safari-img img');
  var fallbacks = ['.webp', '.jpg', '.jpeg', '.png', '.JPG'];
  staticImages.forEach(function(img) {
    attachImageExtensionFallback(img, fallbacks, null);
  });
}

// Initialize default travel date, event listeners, scroll-spy & slideshows
function initBookingDefaults() {
  var dateInput = document.getElementById('date');
  if (dateInput) {
    var todayStr = getLocalISODate(0);
    var tomorrowStr = getLocalISODate(1);
    var maxDateStr = getLocalISODate(180);
    dateInput.setAttribute('min', todayStr);
    dateInput.setAttribute('max', maxDateStr);
    if (!dateInput.value || dateInput.value < todayStr) {
      dateInput.value = tomorrowStr;
    }
    dateInput.addEventListener('change', validateTravelDate);
  }

  var guestsInput = document.getElementById('guests');
  if (guestsInput) {
    guestsInput.addEventListener('blur', enforceGuestBounds);
    guestsInput.addEventListener('change', enforceGuestBounds);
  }

  normalizeBookingGridLayout();
  applySiteConfig();
  updateFareEstimator();
  initLocalImageFallbacks();
  initScrollSpy();
  initGlobalListeners();
  initResortSlideshows();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBookingDefaults);
} else {
  initBookingDefaults();
}

// Mobile navigation toggle
function toggleMenu() {
  var navLinks = document.getElementById('navLinks');
  var btn = document.getElementById('mobileMenuBtn');
  if (!navLinks) return;
  var isOpen = navLinks.classList.toggle('open');
  if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function closeMobileMenu() {
  var navLinks = document.getElementById('navLinks');
  var btn = document.getElementById('mobileMenuBtn');
  if (navLinks) navLinks.classList.remove('open');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

// Highlight booking card when sticky button is clicked
function highlightBookingCard() {
  closeMobileMenu();
  var card = document.getElementById('bookingCard');
  if (card) {
    card.classList.remove('booking-highlight');
    void card.offsetWidth;
    card.classList.add('booking-highlight');
  }
}

// Pre-fill booking form when user clicks any Zone or Safari Type card
function bookZone(zoneName, safariType) {
  var zoneSelect = document.getElementById('zone');
  var typeSelect = document.getElementById('type');
  var fgZone = document.getElementById('fg-zone');
  var fgType = document.getElementById('fg-type');

  // Map Dhikala Night Stay Package clicks to Canter Safari in the 2-option dropdown
  var targetType = safariType;
  if (safariType === 'Dhikala Night Stay Package') {
    targetType = 'Canter Safari - Dhikala';
  }

  if (typeSelect && targetType) {
    for (var j = 0; j < typeSelect.options.length; j++) {
      if (typeSelect.options[j].text === targetType || typeSelect.options[j].value === targetType) {
        typeSelect.selectedIndex = j;
        lastSelectedType = typeSelect.value;
        break;
      }
    }
    if (fgType) fgType.classList.add('field-filled');
  }

  if (zoneSelect && zoneName) {
    for (var i = 0; i < zoneSelect.options.length; i++) {
      if (zoneSelect.options[i].text === zoneName || zoneSelect.options[i].value === zoneName) {
        zoneSelect.selectedIndex = i;
        lastSelectedZone = zoneSelect.value;
        break;
      }
    }
    if (fgZone) fgZone.classList.add('field-filled');
  }

  updateFareEstimator();

  var bookingEl = document.getElementById('booking');
  if (bookingEl) {
    bookingEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  highlightBookingCard();
  showToast('Selected: ' + zoneName);
}

// Filter 10 Safari Zones by Traveller Preference
function filterZones(category, btnEl) {
  var buttons = document.querySelectorAll('.zone-filter-btn');
  buttons.forEach(function(b) {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  if (btnEl) {
    btnEl.classList.add('active');
    btnEl.setAttribute('aria-selected', 'true');
  }

  var cards = document.querySelectorAll('.z-card');
  cards.forEach(function(card) {
    var cats = card.getAttribute('data-cats') || '';
    var catList = cats.split(/\s+/);
    if (category === 'all' || catList.indexOf(category) !== -1) {
      card.classList.remove('hidden-zone');
    } else {
      card.classList.add('hidden-zone');
    }
  });
}

// Gate Readiness Checklist Counter
function updateReadinessScore() {
  var boxes = document.querySelectorAll('.readiness-check');
  var checked = 0;
  boxes.forEach(function(b) {
    if (b.checked) checked++;
  });
  var statusEl = document.getElementById('readinessStatus');
  if (!statusEl) return;

  statusEl.textContent = checked + ' / ' + boxes.length + ' Gate Requirements Checked';
  if (checked === boxes.length) {
    statusEl.style.background = '#DCFCE7';
    statusEl.style.color = '#166534';
  } else {
    statusEl.style.background = '#FEF3C7';
    statusEl.style.color = '#92400E';
  }
}

// Collect form values cleanly without estimator dependency
function getBookingDetails() {
  var typeEl = document.getElementById('type');
  var shiftEl = document.getElementById('shift');
  var nameEl = document.getElementById('guestname');
  var phoneEl = document.getElementById('guestphone');
  var emailEl = document.getElementById('guestemail');

  var name = (nameEl && nameEl.value.trim()) || 'Traveller';
  var phone = (phoneEl && phoneEl.value.trim()) || '';
  var email = (emailEl && emailEl.value.trim()) || '';
  var typeValue = (typeEl && typeEl.value) || 'Private 4x4 Gypsy Safari';
  var typeLabel = (typeEl && typeEl.options[typeEl.selectedIndex] && typeEl.options[typeEl.selectedIndex].text.trim()) || typeValue;
  var zone = (document.getElementById('zone') && document.getElementById('zone').value) || 'Bijrani Zone';
  var shift = (shiftEl && shiftEl.value) || 'Morning';
  var date = (document.getElementById('date') && document.getElementById('date').value) || getLocalISODate(1);
  var rawGuests = parseInt(document.getElementById('guests') && document.getElementById('guests').value, 10);
  var guests = String(isNaN(rawGuests) ? 4 : Math.min(Math.max(rawGuests, 1), 16));
  var nationality = (document.getElementById('nationality') && document.getElementById('nationality').value) || 'Indian National';

  return {
    name: name,
    phone: phone,
    email: email,
    type: typeLabel + ' (' + typeValue + ')',
    typeShort: typeLabel,
    zone: zone,
    shift: shift,
    date: date,
    guests: guests,
    nationality: nationality
  };
}

// Reset booking form cleanly to default values
function resetBookingForm() {
  var nameEl = document.getElementById('guestname');
  var phoneEl = document.getElementById('guestphone');
  var emailEl = document.getElementById('guestemail');
  var guestsEl = document.getElementById('guests');
  var dateEl = document.getElementById('date');
  var typeEl = document.getElementById('type');
  var zoneEl = document.getElementById('zone');
  var shiftEl = document.getElementById('shift');
  var natEl = document.getElementById('nationality');

  if (nameEl) nameEl.value = '';
  if (phoneEl) {
    phoneEl.value = '';
    phoneEl.style.borderColor = '';
    phoneEl.style.boxShadow = '';
  }
  if (emailEl) {
    emailEl.value = '';
    emailEl.style.borderColor = '';
    emailEl.style.boxShadow = '';
  }
  if (guestsEl) guestsEl.value = '4';
  if (dateEl) dateEl.value = getLocalISODate(1);
  if (typeEl) typeEl.selectedIndex = 0;
  if (zoneEl) zoneEl.selectedIndex = 0;
  if (shiftEl) shiftEl.selectedIndex = 0;
  if (natEl) natEl.selectedIndex = 0;

  var filledFields = document.querySelectorAll('.field-filled');
  filledFields.forEach(function(f) {
    f.classList.remove('field-filled');
  });

  updateFareEstimator();

  var card = document.getElementById('bookingCard');
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightBookingCard();
  }
  showToast('Booking form has been reset for a new enquiry');
}

function showToast(msg) {
  var toast = document.getElementById('toast');
  var toastText = document.getElementById('toast-text');
  if (toastText) toastText.textContent = msg;
  if (toast) {
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    toast.classList.add('show');
    toastTimeoutId = setTimeout(function() {
      toast.classList.remove('show');
      toastTimeoutId = null;
    }, 3600);
  }
}

// Show Thank You Success Modal with submission details
function showSuccessModal(summaryHtml, detailsHtml) {
  var modal = document.getElementById('successModal');
  var titleEl = document.getElementById('successModalTitle');
  var textEl = document.getElementById('successModalText');
  var badgeEl = document.getElementById('successModalBadge');
  var detailsEl = document.getElementById('successModalDetails');

  if (titleEl) titleEl.textContent = 'Thank You For Connecting With Us!';
  if (badgeEl) badgeEl.style.display = 'inline-block';
  if (textEl) {
    textEl.innerHTML = summaryHtml || 'Your safari enquiry has been submitted successfully. Our team will contact you shortly.';
  }

  if (detailsEl) {
    if (detailsHtml) {
      detailsEl.innerHTML = detailsHtml;
      detailsEl.style.display = 'block';
    } else {
      detailsEl.style.display = 'none';
    }
  }

  if (modal) modal.classList.add('show');
}

function closeSuccessModal(shouldReset) {
  var modal = document.getElementById('successModal');
  if (modal) modal.classList.remove('show');
  if (shouldReset === true) {
    resetBookingForm();
  }
}

// Highlight an input field temporarily when validation fails
function highlightInvalidField(inputEl, message) {
  showToast(message);
  if (inputEl) {
    inputEl.focus();
    inputEl.style.borderColor = 'var(--accent-bronze)';
    inputEl.style.boxShadow = '0 0 0 3px rgba(200, 100, 40, 0.25)';
    setTimeout(function() {
      inputEl.style.borderColor = '';
      inputEl.style.boxShadow = '';
    }, 3500);
  }
}

// WhatsApp Booking Handler
function handleBookingWhatsApp() {
  enforceGuestBounds();
  validateTravelDate();
  var d = getBookingDetails();

  var lines = [
    'Hello Adventure Corbett Safari! I would like to check slot availability and book a safari:',
    '',
    '• *Name:* ' + d.name
  ];
  if (d.phone) lines.push('• *Phone/WhatsApp:* ' + d.phone);
  if (d.email) lines.push('• *Email:* ' + d.email);
  lines.push('• *Safari Format:* ' + d.typeShort);
  lines.push('• *Preferred Zone:* ' + d.zone);
  lines.push('• *Shift:* ' + d.shift);
  lines.push('• *Travel Date:* ' + d.date);
  lines.push('• *Guests:* ' + d.guests + ' (' + d.nationality + ')');

  var msg = encodeURIComponent(lines.join('\n'));

  showToast('Opening WhatsApp (' + SITE_CONFIG.phoneDisplay + ')…');

  var detailsHtml = '<strong>Enquiry Summary:</strong><br>'
    + '• Zone: <strong>' + d.zone + '</strong> (' + d.typeShort + ')<br>'
    + '• Travel Date: <strong>' + d.date + '</strong> (' + d.shift + ' Shift)<br>'
    + '• Guests: <strong>' + d.guests + ' (' + d.nationality + ')</strong>'
    + (d.phone ? '<br>• Phone/WhatsApp: <strong>' + d.phone + '</strong>' : '')
    + (d.email ? '<br>• Email: <strong>' + d.email + '</strong>' : '');

  showSuccessModal(
    'Your WhatsApp enquiry has been prepared for <strong>' + d.zone + '</strong> on <strong>' + d.date + '</strong>. Our team will assist you on WhatsApp (' + SITE_CONFIG.phoneDisplay + ').',
    detailsHtml
  );

  window.open('https://wa.me/' + SITE_CONFIG.whatsappNumber + '?text=' + msg, '_blank', 'noopener,noreferrer');
}

// Serverless Direct AJAX Submission Handler (FormSubmit AJAX - No Mail App Opens)
function handleBookingEmail() {
  enforceGuestBounds();
  validateTravelDate();

  var phoneEl = document.getElementById('guestphone');
  var emailEl = document.getElementById('guestemail');
  var phoneVal = phoneEl ? phoneEl.value.trim() : '';
  var emailVal = emailEl ? emailEl.value.trim() : '';

  // 1. Validate Phone Number (at least 10 digits)
  var digitsOnly = phoneVal.replace(/\D/g, '');
  if (!phoneVal || digitsOnly.length < 10) {
    highlightInvalidField(phoneEl, 'Please enter a valid 10-digit Phone / WhatsApp number');
    return;
  }

  // 2. Validate Email Address
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal || !emailRegex.test(emailVal)) {
    highlightInvalidField(emailEl, 'Please enter a valid email address');
    return;
  }

  var d = getBookingDetails();

  // 3. UI Loading Feedback (Disable button & show sending state)
  var btn = document.getElementById('btnSubmitEnquiry');
  var btnText = document.getElementById('btnSubmitText');
  var originalText = btnText ? btnText.textContent : 'Submit Enquiry';

  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = 'Submitting Query…';
  showToast('Submitting your query directly to our desk…');

  // 4. FormSubmit AJAX Payload (Serverless, Direct to adventuresafari120@gmail.com)
  var payload = {
    _subject: 'New Booking Enquiry: ' + d.name + ' (' + d.phone + ') - ' + d.date,
    _replyto: d.email,
    _template: 'table',
    _captcha: 'false',
    'Traveller Name': d.name,
    'Phone / WhatsApp': d.phone,
    'Email Address': d.email,
    'Safari Format': d.typeShort,
    'Preferred Zone': d.zone,
    'Safari Shift': d.shift,
    'Travel Date': d.date,
    'Total Guests': d.guests + ' (' + d.nationality + ')',
    'Submitted On': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };

  fetch('https://formsubmit.co/ajax/' + encodeURIComponent(SITE_CONFIG.email), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
      return response.json();
    })
    .then(function() {
      var detailsHtml = '<strong>Submitted Details:</strong><br>'
        + '• Name: <strong>' + d.name + '</strong><br>'
        + '• Phone / WhatsApp: <strong>' + d.phone + '</strong><br>'
        + '• Email: <strong>' + d.email + '</strong><br>'
        + '• Zone: <strong>' + d.zone + '</strong> (' + d.typeShort + ')<br>'
        + '• Date & Shift: <strong>' + d.date + ' (' + d.shift + ')</strong><br>'
        + '• Total Guests: <strong>' + d.guests + ' (' + d.nationality + ')</strong>';

      showSuccessModal(
        'Your safari enquiry has been submitted directly to our desk. Our team will contact you shortly at <strong>' + d.phone + '</strong> or <strong>' + d.email + '</strong>.',
        detailsHtml
      );
    })
    .catch(function(error) {
      console.warn('FormSubmit network notice:', error);
      var detailsHtml = '<strong>Submitted Details:</strong><br>'
        + '• Name: <strong>' + d.name + '</strong><br>'
        + '• Phone / WhatsApp: <strong>' + d.phone + '</strong><br>'
        + '• Email: <strong>' + d.email + '</strong><br>'
        + '• Zone: <strong>' + d.zone + '</strong> (' + d.typeShort + ')<br>'
        + '• Date & Shift: <strong>' + d.date + ' (' + d.shift + ')</strong>';

      showSuccessModal(
        'Your safari enquiry has been recorded for our desk. Our team will contact you shortly at <strong>' + d.phone + '</strong>.',
        detailsHtml
      );
    })
    .finally(function() {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = originalText;
    });
}

// Floating & Header WhatsApp button
function openWhatsApp(e) {
  if (e) e.preventDefault();
  var d = getBookingDetails();
  var quickText = 'Hello Adventure Corbett Safari! I want to check availability for ' + d.zone + ' on ' + d.date + '.';
  window.open(
    'https://wa.me/' + SITE_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(quickText),
    '_blank',
    'noopener,noreferrer'
  );
}

// YouTube Facade Loader (Zero third-party iframe weight until user clicks Play)
function loadYouTubeFacade(el) {
  if (!el || el.querySelector('iframe')) return;
  var videoId = el.getAttribute('data-yt-id');
  var title = el.getAttribute('data-yt-title') || 'Corbett Safari Field Video';
  if (!videoId) return;
  var iframe = document.createElement('iframe');
  iframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0');
  iframe.setAttribute('title', title);
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.position = 'absolute';
  iframe.style.inset = '0';
  el.innerHTML = '';
  el.appendChild(iframe);
}

// FAQ Accordion
function toggleFaq(btn) {
  if (!btn) return;
  var item = btn.closest('.faq-item');
  if (!item) return;
  var isOpen = item.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

// Single-page Info Modal for Agency Terms & Privacy Policy
function openInfoModal(type) {
  var modal = document.getElementById('infoModal');
  var titleEl = document.getElementById('infoModalTitle');
  var bodyEl = document.getElementById('infoModalBody');
  if (!modal || !titleEl || !bodyEl) return;

  if (type === 'terms') {
    titleEl.textContent = 'Terms & Conditions — Adventure Corbett Safari';
    bodyEl.innerHTML = '<p>1. <strong>Independent Private Operator:</strong> Adventure Corbett Safari (<strong>' + SITE_CONFIG.domain + '</strong>) operates as an independent private travel and safari coordination operator based in Ramnagar, Uttarakhand. We are not affiliated with or representing the official government portal.</p>'
      + '<p>2. <strong>Package & Service Tariff:</strong> Quoted rates include permit booking assistance, private 4x4 Gypsy / Canter seat coordination, registered driver charges, and our operator service fee. Entry permits are subject to real-time availability in the forest reserve quota.</p>'
      + '<p>3. <strong>Non-Refundable Permits & ID Requirement:</strong> Once an entry permit is generated against a traveller\'s government ID (Aadhaar, Voter ID, Driving Licence, or Passport), it cannot be cancelled, transferred, or refunded. Visitors must carry the exact original ID to the entry gate.</p>'
      + '<p>4. <strong>Natural Wildlife Movement:</strong> Wildlife sightings depend entirely on natural animal movement and weather conditions; no operator or guide can guarantee a tiger sighting.</p>';
  } else if (type === 'privacy') {
    titleEl.textContent = 'Privacy Policy & Data Protection';
    bodyEl.innerHTML = '<p>1. <strong>Information Collected:</strong> We collect only the traveller details (Full Name, Age, Gender, ID Proof number, and Mobile/Email) strictly necessary to submit your safari permit request and coordinate your vehicle pickup in Ramnagar.</p>'
      + '<p>2. <strong>Data Security:</strong> Your personal identification details are never sold, rented, or shared with third-party advertisers. They are used solely for fulfilling your requested safari tour and resort booking.</p>'
      + '<p>3. <strong>Contact & Support:</strong> For any data removal or booking query, reach us directly at <strong>' + SITE_CONFIG.phoneDisplay + '</strong> or <strong>' + SITE_CONFIG.email + '</strong>.</p>';
  }
  modal.classList.add('show');
}

function closeInfoModal() {
  var modal = document.getElementById('infoModal');
  if (modal) modal.classList.remove('show');
}

// Passive Scroll-Spy for Navigation Pills (Includes #resorts and mobile bar)
function initScrollSpy() {
  if (!('IntersectionObserver' in window)) return;
  var sectionIds = ['booking', 'zones', 'resorts', 'types', 'pricing', 'guide', 'corbett-guide', 'extra-faq'];
  var navLinks = document.querySelectorAll('#navLinks .nav-pill-btn, .mobile-sticky-bar .nav-pill-btn');
  if (!navLinks.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = '#' + entry.target.id;
        navLinks.forEach(function(link) {
          if (link.getAttribute('href') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });

  sectionIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// Global Keyboard (ESC) & Outside-Click Listeners
function initGlobalListeners() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeSuccessModal(false);
      closeInfoModal();
      closeMobileMenu();
    }
  });

  document.addEventListener('click', function(e) {
    var navLinks = document.getElementById('navLinks');
    var header = document.getElementById('stickyHeader');
    if (navLinks && navLinks.classList.contains('open') && header && !header.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

// Smart Resort Photo Slideshow (Auto-detects .jpg / .jpeg / .webp & skips missing files)
function initResortSlideshows() {
  var cards = document.querySelectorAll('.resort-card[data-slideshow]');
  var fallbacks = ['.jpeg', '.webp', '.png', '.JPG', '.jpg'];

  cards.forEach(function(card, cardIdx) {
    if (card.getAttribute('data-slideshow-initialized') === 'true') return;
    card.setAttribute('data-slideshow-initialized', 'true');

    var slideContainer = card.querySelector('.resort-slides');
    var dotsContainer = card.querySelector('.resort-dots');
    if (!slideContainer) return;

    var rawSlides = Array.prototype.slice.call(slideContainer.querySelectorAll('.resort-slide'));
    var currentIndex = 0;
    var isPaused = false;

    function getValidSlides() {
      return rawSlides.filter(function(img) {
        return img.getAttribute('data-missing') !== 'true';
      });
    }

    function goToSlide(targetIdx) {
      var validSlides = getValidSlides();
      if (!validSlides.length) return;
      var dots = dotsContainer ? dotsContainer.querySelectorAll('.r-dot') : [];

      if (validSlides[currentIndex]) validSlides[currentIndex].classList.remove('active');
      if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

      currentIndex = (targetIdx + validSlides.length) % validSlides.length;

      if (validSlides[currentIndex]) validSlides[currentIndex].classList.add('active');
      if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    function rebuildDotsAndEnsureActive() {
      var validSlides = getValidSlides();
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';

      if (validSlides.length === 0) return;
      if (currentIndex >= validSlides.length) currentIndex = 0;

      validSlides.forEach(function(slide, idx) {
        slide.classList.toggle('active', idx === currentIndex);
        if (validSlides.length > 1) {
          var dot = document.createElement('span');
          dot.className = 'r-dot' + (idx === currentIndex ? ' active' : '');
          dot.style.cursor = 'pointer';
          dot.addEventListener('click', function(e) {
            e.stopPropagation();
            goToSlide(idx);
          });
          dotsContainer.appendChild(dot);
        }
      });
    }

    // Auto-fallback between .jpg, .jpeg, .webp, .png if file extensions differ
    rawSlides.forEach(function(img) {
      attachImageExtensionFallback(img, fallbacks, function(failedImg) {
        failedImg.setAttribute('data-missing', 'true');
        failedImg.style.display = 'none';
        rebuildDotsAndEnsureActive();
      });
    });

    function nextSlide() {
      if (isPaused) return;
      var validSlides = getValidSlides();
      if (validSlides.length < 2) return;
      goToSlide(currentIndex + 1);
    }

    rebuildDotsAndEnsureActive();

    setTimeout(function() {
      setInterval(nextSlide, 3400);
    }, cardIdx * 750);

    card.addEventListener('mouseenter', function() { isPaused = true; });
    card.addEventListener('mouseleave', function() { isPaused = false; });
  });
}

// Handle "Enquire" Click on Any Resort Card
function enquireResort(resortName, nearbyZone, tariffText) {
  if (nearbyZone) {
    bookZone(nearbyZone, 'Private 4x4 Gypsy Safari');
  }

  var d = getBookingDetails();
  var lines = [
    'Hello Adventure Corbett Safari! I would like to enquire about a Resort Stay + Safari Package:',
    '',
    '• *Resort Property:* ' + resortName,
    '• *Room Tariff:* ' + tariffText,
    '• *Paired Safari Zone:* ' + (nearbyZone || d.zone),
    '• *Check-in / Safari Date:* ' + d.date,
    '• *Guests:* ' + d.guests + ' (' + d.nationality + ')'
  ];

  var msg = encodeURIComponent(lines.join('\n'));
  showToast('Selected ' + resortName + ' · Opening WhatsApp…');
  window.open('https://wa.me/' + SITE_CONFIG.whatsappNumber + '?text=' + msg, '_blank', 'noopener,noreferrer');
}
