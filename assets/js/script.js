/* =========================================================
   JAVASCRIPT FILE INDEX — use Ctrl+F to jump to a section
   JS-01: RUN AFTER HTML HAS LOADED
   JS-02: ACTIVE NAVIGATION LINK
   JS-03: MOBILE MENU OPEN / CLOSE
   JS-04: HERO SLIDER + DOT CONTROLS + AUTO-ROTATION
   JS-05: FOOTER COPYRIGHT YEAR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ================= JS-02: ACTIVE NAVIGATION LINK ================= */
  const currentPage = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".main-nav a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });

  /* ================= JS-03: MOBILE MENU OPEN / CLOSE ================= */
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ================= JS-04: HERO SLIDER + DOTS + AUTO-ROTATION ================= */
  const slides = [...document.querySelectorAll(".hero-slide")];
  const sliderDots = [...document.querySelectorAll(".slider-dot")];

  if (slides.length > 1) {
    let currentSlide = 0;
    let sliderTimer;

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === currentSlide);
      });

      sliderDots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentSlide;
        dot.classList.toggle("active", isActive);

        if (isActive) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    };

    const startAutoRotation = () => {
      clearInterval(sliderTimer);
      sliderTimer = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 5000);
    };

    sliderDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        startAutoRotation();
      });
    });

    const heroSlider = document.querySelector(".hero-slider");

    if (heroSlider) {
      heroSlider.addEventListener("mouseenter", () => {
        clearInterval(sliderTimer);
      });
      heroSlider.addEventListener("mouseleave", startAutoRotation);
    }

    showSlide(0);
    startAutoRotation();
  }

  /* ================= JS-05: FOOTER COPYRIGHT YEAR ================= */
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
