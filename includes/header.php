<?php
$currentPage = basename($_SERVER['PHP_SELF'] ?? 'index.php');
$menuItems = [
    'index.php' => 'Home',
    'jeep-safari.php' => 'Jeep Safari',
    'night-stay.php' => 'Night Stay',
    'canter-safari.php' => 'Canter Safari',
    'about-us.php' => 'About Us',
    'contact.php' => 'Contact',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle ?? 'Corbett Safari', ENT_QUOTES, 'UTF-8') ?></title>
    <meta name="description" content="<?= htmlspecialchars($metaDescription ?? 'Explore Corbett safari and stay options.', ENT_QUOTES, 'UTF-8') ?>">
    <meta name="theme-color" content="#10271e">
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
<header class="site-header">
    <div class="header-inner">
        <a href="/index.php" class="site-logo" aria-label="Corbett Safari home">
            <img src="/assets/images/logo.png" alt="Corbett Safari logo" width="180" height="60">
        </a>
        <button class="menu-toggle" type="button" aria-label="Open navigation menu"
                aria-expanded="false" aria-controls="primary-navigation">
            <span></span><span></span><span></span>
        </button>
        <nav class="main-nav" id="primary-navigation" aria-label="Main navigation">
            <?php foreach ($menuItems as $url => $label): ?>
                <a href="/<?= htmlspecialchars($url, ENT_QUOTES, 'UTF-8') ?>"
                   class="<?= $currentPage === $url ? 'active' : '' ?>"
                   <?= $currentPage === $url ? 'aria-current="page"' : '' ?>>
                    <?= htmlspecialchars($label, ENT_QUOTES, 'UTF-8') ?>
                </a>
            <?php endforeach; ?>
        </nav>
    </div>
</header>
