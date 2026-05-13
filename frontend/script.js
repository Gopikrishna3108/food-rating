document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const starsInput = document.getElementById('stars');
    const starsError = document.getElementById('stars-error');
    const form = document.getElementById('rating-form');
    const submitBtn = document.getElementById('submit-btn');
    const spinner = document.querySelector('.spinner');
    const btnText = submitBtn.querySelector('span');
    const successMessage = document.getElementById('success-message');
    const resetBtn = document.getElementById('reset-btn');

    let currentRating = 0;

    // Star Rating Logic
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const val = this.getAttribute('data-value');
            highlightStars(val, 'hover-active');
        });

        star.addEventListener('mouseout', function() {
            removeHighlight('hover-active');
        });

        star.addEventListener('click', function() {
            currentRating = this.getAttribute('data-value');
            starsInput.value = currentRating;
            starsError.style.display = 'none';
            highlightStars(currentRating, 'active');
        });
    });

    function highlightStars(val, className) {
        stars.forEach(star => {
            if (star.getAttribute('data-value') <= val) {
                star.classList.add(className);
            } else {
                if (className === 'active') star.classList.remove('active');
            }
        });
    }

    function removeHighlight(className) {
        stars.forEach(star => star.classList.remove(className));
    }

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentRating) {
            starsError.style.display = 'block';
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            stars: parseInt(currentRating),
            experience: document.getElementById('experience').value
        };

        // UI Loading State
        submitBtn.disabled = true;
        btnText.textContent = 'Submitting...';
        spinner.style.display = 'block';

        try {
            // Dynamic API URL based on environment
            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://localhost:3000/api/rate' 
                : 'https://food-rating-1.onrender.com/api/rate';

            // Send to Backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Success
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting your rating. Please try again.');
        } finally {
            // Restore UI State
            submitBtn.disabled = false;
            btnText.textContent = 'Submit Rating';
            spinner.style.display = 'none';
        }
    });

    // Reset Form
    resetBtn.addEventListener('click', () => {
        form.reset();
        currentRating = 0;
        starsInput.value = '';
        removeHighlight('active');
        
        successMessage.classList.add('hidden');
        form.classList.remove('hidden');
    });
});
