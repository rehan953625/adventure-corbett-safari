<section class="enquiry-section" id="enquiry">
    <div class="enquiry-heading">
        <p class="eyebrow">LET'S PLAN YOUR VISIT</p>
        <h2>Plan Your Corbett Experience</h2>
        <p>Share your details and our team can get in touch.</p>
    </div>
    <form class="enquiry-form" action="/submit-enquiry.php" method="POST">
        <div class="form-field">
            <label for="visitor-name">Full Name</label>
            <input id="visitor-name" name="name" type="text" placeholder="Enter your full name"
                   autocomplete="name" maxlength="100" required>
        </div>
        <div class="form-field">
            <label for="visitor-mobile">Mobile Number</label>
            <input id="visitor-mobile" name="mobile" type="tel" placeholder="Enter your mobile number"
                   autocomplete="tel" maxlength="20" required>
        </div>
        <div class="form-field">
            <label for="visitor-email">Email Address</label>
            <input id="visitor-email" name="email" type="email" placeholder="Enter your email address"
                   autocomplete="email" maxlength="254" required>
        </div>
        <button type="submit" class="submit-button">Submit Enquiry</button>
    </form>
</section>
