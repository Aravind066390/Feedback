document.addEventListener('DOMContentLoaded', function () {
    // Initialize EmailJS
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not loaded.');
        return;
    }
    emailjs.init('3iDRLwwn_yUQ');

    const feedbackForm = document.getElementById('feedbackForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const errorMessage = document.getElementById('errorMessage');
    const newFeedbackBtn = document.getElementById('newFeedbackBtn');
    const tryAgainBtn = document.getElementById('tryAgainBtn');

    feedbackForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(feedbackForm);

        // Validate inputs
        if (!validateForm(formData)) return;

        const feedbackData = Object.fromEntries(formData.entries());
        feedbackData.timestamp = new Date().toLocaleString();

        const submitButton = feedbackForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        sendFeedback(feedbackData, submitButton);
    });

    function validateForm(formData) {
        const requiredFields = ['name', 'email', 'feedbackDetails'];
        for (const field of requiredFields) {
            if (!formData.get(field).trim()) {
                alert(`Please fill in the ${field}.`);
                return false;
            }
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.get('email'))) {
            alert('Please enter a valid email address.');
            return false;
        }
        return true;
    }

    function sendFeedback(data, button) {
        const messageContent = `
Name: ${data.name}
Email: ${data.email}
Department: ${data.department || 'Not specified'}
Rating: ${data.rating || 'Not rated'}
Feedback Type: ${data.feedbackType || 'General'}
Module Affected: ${data.moduleAffected || 'Not specified'}
Feedback Details: ${data.feedbackDetails}
Urgency: ${data.urgency || 'Normal'}
Timestamp: ${data.timestamp}
        `;

        emailjs.send('service_2zqbwko', 'template_5gl88ss', {
            from_name: data.name,
            from_email: data.email,
            message: messageContent
        })
            .then(function () {
                showThankYou();
                console.log('Feedback sent successfully!');
            })
            .catch(function (error) {
                showError();
                console.error('Sending failed:', error);
            })
            .finally(function () {
                button.disabled = false;
                button.textContent = 'Submit Feedback';
            });
    }

    function showThankYou() {
        feedbackForm.classList.add('hidden');
        thankYouMessage.classList.remove('hidden');
        newFeedbackBtn.classList.remove('hidden');
        thankYouMessage.scrollIntoView({ behavior: 'smooth' });
    }

    function showError() {
        feedbackForm.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        tryAgainBtn.classList.remove('hidden');
        errorMessage.scrollIntoView({ behavior: 'smooth' });
    }

    newFeedbackBtn.addEventListener('click', function () {
        feedbackForm.reset();
        feedbackForm.classList.remove('hidden');
        thankYouMessage.classList.add('hidden');
        newFeedbackBtn.classList.add('hidden');
    });

    tryAgainBtn.addEventListener('click', function () {
        feedbackForm.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        tryAgainBtn.classList.add('hidden');
    });
});
