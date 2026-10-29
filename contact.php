<?php
$pageTitle = 'Contact Us | Corbett Safari';
$metaDescription = 'Contact us to ask questions and plan your Corbett visit.';
$heroTitle = 'Contact Us';
$heroSubtitle = 'Tell us what you need help planning.';
require __DIR__ . '/includes/header.php';
require __DIR__ . '/includes/hero.php';
?>
<main>
    <section class="intro-section">
        <p class="eyebrow">GET IN TOUCH</p>
        <h2>How Can We Help?</h2>
        <p>Submit the enquiry form and add your verified business phone number, email and address here.</p>
    </section>
    <?php require __DIR__ . '/includes/enquiry-form.php'; ?>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
