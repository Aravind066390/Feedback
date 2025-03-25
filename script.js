document.addEventListener('DOMContentLoaded', function() {
    // Validate EmailJS configuration
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not loaded. Make sure to include the EmailJS script.');
        return;
    }

    // Initialize EmailJS with your User ID
    emailjs.init('3iDRLwwn_yUQ');

    // Get DOM elements
    const feedbackForm = document.getElementById('feedbackForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const errorMessage = document.getElementById('errorMessage');
    const newFeedbackBtn = document.getElementById('newFeedbackBtn');
    const tryAgainBtn = document.getElementById('tryAgainBtn');

    // Validate form inputs before submission
    function validateForm(formData) {
        const requiredFields = ['name', 'email', 'feedbackDetails'];
        for (const field of requiredFields) {
            if (!formData.get(field) || formData.get(field).trim() === '') {
                alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                return false;
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.get('email'))) {
            alert('Please enter a valid email address.');
            return false;
        }

        return true;
    }

    // Handle form submission
    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        const formData = new FormData(feedbackForm);

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Convert FormData to object
        const feedbackData = {};
        for (const [key, value] of formData.entries()) {
            feedbackData[key] = value;
        }

        // Add timestamp
        feedbackData.timestamp = new Date().toLocaleString();

        // Disable submit button to prevent multiple submissions
        const submitButton = feedbackForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Send the feedback data to EmailJS
        sendFeedbackToEmail(feedbackData, submitButton);
    });

    // Function to send feedback to EmailJS
    function sendFeedbackToEmail(feedbackData, submitButton) {
        const messageBody = `
        Name: ${feedbackData.name}
        Email: ${feedbackData.email}
        Department: ${feedbackData.department || 'Not specified'}
        Rating: ${feedbackData.rating || 'Not rated'}
        Feedback Type: ${feedbackData.feedbackType || 'General'}
        Module Affected: ${feedbackData.moduleAffected || 'Not specified'}
        Feedback Details: ${feedbackData.feedbackDetails}
        Urgency: ${feedbackData.urgency || 'Normal'}
        Timestamp: ${feedbackData.timestamp}
        `;

        emailjs.send('service_2zqbwko', 'template_5gl88ss', {
            from_name: feedbackData.name,
            from_email: feedbackData.email,
            message: messageBody
        })
        .then(function(response) {
            showThankYouMessage();
            console.log('Email sent successfully!', response);
        })
        .catch(function(error) {
            showErrorMessage();
            console.error('Email failed to send:', error);
        })
        .finally(function() {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Feedback';
        });
    }

    // Function to show thank you message
    function showThankYouMessage() {
        feedbackForm.classList.add('hidden');
        thankYouMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        // Scroll to the message
        thankYouMessage.scrollIntoView({ behavior: 'smooth' });
    }

    // Function to show error message
    function showErrorMessage() {
        feedbackForm.classList.add('hidden');
        thankYouMessage.classList.add('hidden');
        errorMessage.classList.remove('hidden');

        // Scroll to the message
        errorMessage.scrollIntoView({ behavior: 'smooth' });
    }

    // Button to submit another feedback
    newFeedbackBtn.addEventListener('click', function() {
        resetForm();
    });

    // Button to try again after error
    tryAgainBtn.addEventListener('click', function() {
        feedbackForm.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    });

    // Function to reset form
    function resetForm() {
        feedbackForm.reset();
        feedbackForm.classList.remove('hidden');
        thankYouMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');

        // Scroll to the form
        feedbackForm.scrollIntoView({ behavior: 'smooth' });
    }
});
