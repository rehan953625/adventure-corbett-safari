<section class="hero-slider" aria-label="Corbett safari highlights">
    <div class="hero-slide active">
        <img src="/assets/images/safari-1.webp" alt="Safari landscape in a forest" fetchpriority="high" width="1920" height="850">
        <div class="hero-caption">
            <p class="eyebrow">EXPLORE THE WILD</p>
            <h1><?= htmlspecialchars($heroTitle ?? 'Discover Corbett', ENT_QUOTES, 'UTF-8') ?></h1>
            <p><?= htmlspecialchars($heroSubtitle ?? 'Explore the wilderness of Corbett.', ENT_QUOTES, 'UTF-8') ?></p>
            <a href="#enquiry" class="hero-cta">Plan Your Visit</a>
        </div>
    </div>
    <div class="hero-slide">
        <img src="/assets/images/safari-2.webp" alt="Forest scenery in Corbett" width="1920" height="850" loading="lazy">
        <div class="hero-caption">
            <p class="eyebrow">YOUR WILDERNESS JOURNEY</p>
            <h2>Experience the Forest</h2>
            <p>Discover the landscapes and wildlife of Corbett.</p>
            <a href="#enquiry" class="hero-cta">Send an Enquiry</a>
        </div>
    </div>
    <div class="hero-slide">
        <img src="/assets/images/safari-3.webp" alt="Outdoor safari experience" width="1920" height="850" loading="lazy">
        <div class="hero-caption">
            <p class="eyebrow">MAKE YOUR TRIP MEMORABLE</p>
            <h2>Your Corbett Adventure</h2>
            <p>Explore safari and stay options for your visit.</p>
            <a href="#enquiry" class="hero-cta">Explore Options</a>
        </div>
    </div>
    <div class="slider-dots" aria-label="Choose slide">
        <button type="button" class="slider-dot active" aria-label="Slide 1" aria-current="true"></button>
        <button type="button" class="slider-dot" aria-label="Slide 2"></button>
        <button type="button" class="slider-dot" aria-label="Slide 3"></button>
    </div>
</section>
