
export function handleNewsletterForm({ formId, emailId, consentId, submitId, messageId }) {
    // Create hidden iframe for form submission (shared by all forms, only once)
    if (!document.querySelector('iframe[name="newsletter-iframe"]')) {
        const iframe = document.createElement('iframe');
        iframe.name = 'newsletter-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    const form = document.getElementById(formId);
    if (!form) return;
    const emailInput = document.getElementById(emailId);
    const consentCheckbox = document.getElementById(consentId);
    const submitButton = document.getElementById(submitId);
    const messageDiv = document.getElementById(messageId);
    if (!emailInput || !consentCheckbox || !submitButton) return;
    function checkFormValidity() {
        const isEmailValid = emailInput.validity.valid && emailInput.value.length > 0;
        const isConsentChecked = consentCheckbox.checked;
        submitButton.disabled = !(isEmailValid && isConsentChecked);
    }
    emailInput.addEventListener('input', checkFormValidity);
    emailInput.addEventListener('blur', checkFormValidity);
    consentCheckbox.addEventListener('change', checkFormValidity);
    checkFormValidity();
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = emailInput.value;
        const consent = consentCheckbox.checked;
        if (!consent) {
            showMessage('Please agree to receive updates.', 'error');
            return;
        }
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Subscribing...';
        const tempForm = document.createElement('form');
        tempForm.action = 'https://0bdf3b63.sibforms.com/serve/MUIFANOCfd3ST6j38qsznW_sV4HrIb3uucoGL95CQbYuYdcT6H9Dk11tsIcXgietK6A-GBH2dUmxK2wdC9jEXOBtXFdHnJS4BD8G2hTZbNgJgjvdd-yUuV9Dvz0UF-huqQ0fL80Pb2M_peIansH02KpKb8M5uNwApfj_aesF3UISqH6QPKHnJvM6hUSVdcanZcVpfbH_V8Jbp0li_Q==';
        tempForm.method = 'POST';
        tempForm.target = 'newsletter-iframe';
        tempForm.style.display = 'none';
        const fields = {
            'EMAIL': email,
            'OPT_IN': '1',
            'email_address_check': '',
            'locale': 'en',
            'form_location': form.querySelector('input[name="form_location"]')?.value || ''
        };
        Object.keys(fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            tempForm.appendChild(input);
        });
        document.body.appendChild(tempForm);
        try {
            tempForm.submit();
        } catch (error) {
            showMessage('An error occurred while submitting the form. Please try again later.', 'error');
            submitButton.textContent = originalText;
            document.body.removeChild(tempForm);
            return;
        }
        setTimeout(() => {
            showMessage('Thank you! Please check your email to confirm your subscription.', 'success');
            form.reset();
            checkFormValidity();
            submitButton.textContent = originalText;
            document.body.removeChild(tempForm);
        }, 1000);
    });
    function showMessage(message, type) {
        if (!messageDiv) return;
        messageDiv.textContent = message;
        messageDiv.className = type === 'success'
            ? 'text-white bg-accent p-3 rounded-md text-sm mt-2 block'
            : 'text-white bg-primary p-3 rounded-md text-sm mt-2 block';
        messageDiv.classList.remove('hidden');
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }
}
