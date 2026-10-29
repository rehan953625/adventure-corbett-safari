document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("is-open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        });

        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navigation.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation menu");
            });
        });
    }

    const slides = [...document.querySelectorAll(".hero-slide")];
    const dots = [...document.querySelectorAll(".slider-dot")];
    if (slides.length < 2) return;

    let current = 0;
    let timer;

    function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === current);
            if (i === current) dot.setAttribute("aria-current", "true");
            else dot.removeAttribute("aria-current");
        });
    }

    function startSlider() {
        clearInterval(timer);
        timer = setInterval(() => showSlide(current + 1), 5000);
    }

    dots.forEach((dot, index) => dot.addEventListener("click", () => {
        showSlide(index);
        startSlider();
    }));

    const hero = document.querySelector(".hero-slider");
    if (hero) {
        hero.addEventListener("mouseenter", () => clearInterval(timer));
        hero.addEventListener("mouseleave", startSlider);
    }

    showSlide(0);
    startSlider();
});
