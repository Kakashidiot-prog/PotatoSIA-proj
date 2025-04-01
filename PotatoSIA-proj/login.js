document.addEventListener('DOMContentLoaded', () => {
    // Toggle between login and register forms
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');

    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get input values
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Simple validation (you would replace this with proper authentication)
        if (username && password) {
            // Simulate login (replace with actual authentication logic)
            if (username === 'admin' && password === '1234') {
                // Redirect to index.html on successful login
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password');
            }
        } else {
            alert('Please enter both username and password');
        }
    });

    // Registration form submission
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get input values
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        // Simple validation
        if (username && email && password) {
            // In a real app, you'd send this to a backend for registration
            alert('Registration successful! Please log in.');
            // Switch back to login form
            container.classList.remove('active');
        } else {
            alert('Please fill in all fields');
        }
    });

    // Social login placeholders (you'd implement actual OAuth logic)
    const socialLoginButtons = document.querySelectorAll('.social-icons a');
    socialLoginButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            
            
        });
    });
});