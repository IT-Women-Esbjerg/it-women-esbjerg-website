document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('newsletter-form');

    if (!form) return;

    const emailInput = document.getElementById('newsletter-email');
    const consentCheckbox = document.getElementById('newsletter-consent');
    const submitButton = document.getElementById('newsletter-submit');

    // Create hidden iframe for form submission
    const iframe = document.createElement('iframe');
    iframe.name = 'newsletter-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Function to check if form is valid
    function checkFormValidity() {
        const isEmailValid = emailInput.validity.valid && emailInput.value.length > 0;
        const isConsentChecked = consentCheckbox.checked;

        submitButton.disabled = !(isEmailValid && isConsentChecked);
    }

    // Listen for changes on email and consent
    emailInput.addEventListener('input', checkFormValidity);
    emailInput.addEventListener('blur', checkFormValidity);
    consentCheckbox.addEventListener('change', checkFormValidity);

    // Initial check
    checkFormValidity();

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput.value;
        const consent = consentCheckbox.checked;

        if (!consent) {
            showMessage('Please agree to receive updates.', 'error');
            return;
        }

        // Disable submit button during submission
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Subscribing...';

        // Create a temporary form to submit to the iframe
        const tempForm = document.createElement('form');
        tempForm.action = 'https://0bdf3b63.sibforms.com/serve/MUIFANOCfd3ST6j38qsznW_sV4HrIb3uucoGL95CQbYuYdcT6H9Dk11tsIcXgietK6A-GBH2dUmxK2wdC9jEXOBtXFdHnJS4BD8G2hTZbNgJgjvdd-yUuV9Dvz0UF-huqQ0fL80Pb2M_peIansH02KpKb8M5uNwApfj_aesF3UISqH6QPKHnJvM6hUSVdcanZcVpfbH_V8Jbp0li_Q==';
        tempForm.method = 'POST';
        tempForm.target = 'newsletter-iframe';
        tempForm.style.display = 'none';

        // Add form fields
        const fields = {
            'EMAIL': email,
            'OPT_IN': '1',
            'email_address_check': '',
            'locale': 'en'
        };

        Object.keys(fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            tempForm.appendChild(input);
        });

        document.body.appendChild(tempForm);

        // Submit the form
        try {
            tempForm.submit();
        } catch (error) {
            showMessage('An error occurred while submitting the form. Please try again later.', 'error');
            submitButton.textContent = originalText;
            document.body.removeChild(tempForm);
            return;
        }

        // Show success message after a short delay
        setTimeout(() => {
            showMessage('Thank you! Please check your email to confirm your subscription.', 'success');
            form.reset();
            checkFormValidity();
            submitButton.textContent = originalText;
            document.body.removeChild(tempForm);
        }, 1000);
    });

    function showMessage(message, type) {
        const messageDiv = document.getElementById('newsletter-message');
        if (!messageDiv) return;
        messageDiv.textContent = message;
        messageDiv.className = type === 'success'
            ? 'text-white bg-accent p-3 rounded-md text-sm mt-2 block'
            : 'text-white bg-primary p-3 rounded-md text-sm mt-2 block';
        messageDiv.classList.remove('hidden');

        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }
});
