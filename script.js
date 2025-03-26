document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    (function() {
        emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
    })();

    const form = document.getElementById('feedbackForm');
    const submitBtn = document.getElementById('submitBtn');
    const toastContainer = document.getElementById('toast-container');

    // Toast function
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;
        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate inputs
        if (!name || !email || !message) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Send email using EmailJS
        emailjs.send(
            'YOUR_SERVICE_ID',    // Replace with your service ID
            'YOUR_TEMPLATE_ID',   // Replace with your template ID
            {
                from_name: name,
                from_email: email,
                message: message
            }
        ).then(
            function(response) {
                showToast('Feedback submitted successfully!');
                form.reset();
            },
            function(error) {
                showToast('Failed to submit feedback. Please try again.', 'error');
                console.error('EmailJS Error:', error);
            }
        ).finally(() => {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Feedback';
        });
    });
});
