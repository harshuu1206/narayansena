const API_BASE_URL = "http://20.197.35.47:8090"; // Your backend URL

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const responseMessage = document.getElementById('responseMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            try {
                const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include'
                });

                let result;
                try {
                    result = await response.json();
                } catch (error) {
                    throw new Error('Failed to parse response');
                }

                // ✅ Successfully Logged In
                if (response.ok) {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('userId', result.userId);
                    sessionStorage.setItem('userName', result.userName || 'User'); // Store username

                    console.log('Login Successful - Redirecting...');

                    window.location.href = 'index.html'; // Redirect to home page
                } else {
                    responseMessage.innerHTML = `<p style="color: red;">Login failed: ${result.message || 'Invalid credentials'}</p>`;
                }
            } catch (error) {
                responseMessage.innerHTML = `<p style="color: red;">An error occurred: ${error.message}</p>`;
            }
        });
    }
});
