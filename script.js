document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS (add your public key)
    emailjs.init('3iDRLwwn_yUQ');

    // Get DOM elements
    const feedbackForm = document.getElementById('feedbackForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const errorMessage = document.getElementById('errorMessage');
    const newFeedbackBtn = document.getElementById('newFeedbackBtn');
    const tryAgainBtn = document.getElementById('tryAgainBtn');

    // Handle form submission
    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        const formData = new FormData(feedbackForm);
        const feedbackData = {};

        // Convert FormData to object
        for (const [key, value] of formData.entries()) {
            feedbackData[key] = value;
        }

        // Add timestamp
        feedbackData.timestamp = new Date().toISOString();

        // Send the feedback data to EmailJS
        sendFeedbackToEmail(feedbackData);
    });

    // Function to send feedback to EmailJS
    function sendFeedbackToEmail(feedbackData) {
        const messageBody = `
        Email: ${feedbackData.email}
        Department: ${feedbackData.department}
        Rating: ${feedbackData.rating}
        Feedback Type: ${feedbackData.feedbackType}
        Module Affected: ${feedbackData.moduleAffected}
        Feedback Details: ${feedbackData.feedbackDetails}
        Urgency: ${feedbackData.urgency}
        Timestamp: ${feedbackData.timestamp}
        `;

        emailjs.send('service_2zqbwko', 'template_zlsg7xj', {
            name: feedbackData.name,
            message: messageBody
        }, '3iDRLwwn_yUQ')
        .then(function(response) {
            showThankYouMessage();
            console.log('Email sent successfully!', response);
            console.log('Data sent:', feedbackData);
        })
        .catch(function(error) {
            showErrorMessage();
            console.error('Email failed to send:', error);
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
