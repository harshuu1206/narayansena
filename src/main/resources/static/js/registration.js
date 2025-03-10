const API_BASE_URL = "http://20.197.35.47:8090"; // Updated backend IP

const form = document.getElementById('registrationForm');
const responseMessage = document.getElementById('responseMessage');
const mobileInput = document.getElementById('mobile');
const referrerInput = document.getElementById('referrer');

const mobilePattern = /^[6-9]\d{9}$/;

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous validation states
    form.classList.remove('was-validated');
    mobileInput.classList.remove('is-invalid');
    referrerInput.classList.remove('is-invalid');

    // Validate mobile number format
    if (!mobilePattern.test(mobileInput.value)) {
        mobileInput.classList.add('is-invalid');
        responseMessage.innerHTML = `<p class="text-danger">Please enter a valid 10-digit mobile number.</p>`;
        return;
    }

    // Prepare user data
    const userDto = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        mobileNumber: mobileInput.value.trim(),
        city: document.getElementById('city').value.trim(),
        password: document.getElementById('password').value,
        referrerId: referrerInput.value.trim() || null
    };

    // Check referrer ID if provided
    if (userDto.referrerId) {
        try {
            const checkReferrer = await fetch(`${API_BASE_URL}/api/users/check-referrer/${userDto.referrerId}`);
            if (!checkReferrer.ok) {
                referrerInput.classList.add('is-invalid');
                responseMessage.innerHTML = `<p class="text-danger">The provided Referrer ID does not exist.</p>`;
                return;
            }
        } catch (error) {
            console.error('Error checking referrer:', error);
            responseMessage.innerHTML = `<p class="text-danger">Error verifying Referrer ID. Please try again later.</p>`;
            return;
        }
    }

    // Submit registration
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userDto),
        });

        const data = await response.json();

        if (response.ok) {
            responseMessage.innerHTML = `<p class="text-success">${data.message}</p>`;
            form.reset();
            setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
            // Handle specific errors
            const errorMessage = data.error || 'An unexpected error occurred.';
            if (response.status === 409) { // Conflict error
                responseMessage.innerHTML = `<p class="text-danger">${errorMessage}</p>`;
            } else if (response.status === 400) { // Bad request error
                referrerInput.classList.add('is-invalid');
                responseMessage.innerHTML = `<p class="text-danger">${errorMessage}</p>`;
            } else {
                responseMessage.innerHTML = `<p class="text-danger">${errorMessage}</p>`;
            }
        }
    } catch (error) {
        console.error('Error:', error);
        responseMessage.innerHTML = `<p class="text-danger">Registration failed. Please try again later.</p>`;
    }
});

// Real-time validation for mobile number
mobileInput.addEventListener('input', () => {
    mobileInput.classList.toggle('is-invalid', !mobilePattern.test(mobileInput.value));
});

referrerInput.addEventListener('blur', async () => {
    if (referrerInput.value.trim()) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/check-referrer/${referrerInput.value.trim()}`);
            const data = await response.json();
            if (response.ok) {
                referrerInput.classList.add('is-valid');
                referrerInput.classList.remove('is-invalid');
                responseMessage.innerHTML = `<p class="text-success">${data.message}</p>`;
            } else {
                referrerInput.classList.add('is-invalid');
                referrerInput.classList.remove('is-valid');
                responseMessage.innerHTML = `<p class="text-danger">${data.error}</p>`;
            }
        } catch (error) {
            console.error('Error checking referrer:', error);
            responseMessage.innerHTML = `<p class="text-danger">Error verifying Referrer ID. Please try again later.</p>`;
        }
    }
});
