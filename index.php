<?php
$pageTitle = 'Corbett Safari | Jeep Safari & Nature Stays';
$metaDescription = 'Explore Corbett safari experiences and nature stays. Send an enquiry to plan your visit.';
$heroTitle = 'Discover the Wild';
$heroSubtitle = 'Explore the forests, wildlife and natural beauty of Corbett.';
require __DIR__ . '/includes/header.php';
require __DIR__ . '/includes/hero.php';
?>
<main>
    <section class="intro-section">
        <p class="eyebrow">YOUR NEXT ADVENTURE</p>
        <h2>Explore Corbett Your Way</h2>
        <p>Discover safari experiences and accommodation options for your planned visit.</p>
        <div class="service-grid">
            <a class="service-card" href="/jeep-safari.php"><h3>Jeep Safari</h3><p>Explore available safari information and visitor guidance.</p></a>
            <a class="service-card" href="/canter-safari.php"><h3>Canter Safari</h3><p>Learn about canter safari options and planning your visit.</p></a>
            <a class="service-card" href="/night-stay.php"><h3>Night Stay</h3><p>Explore accommodation options for your Corbett trip.</p></a>
        </div>
    </section>
    <?php require __DIR__ . '/includes/enquiry-form.php'; ?>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
