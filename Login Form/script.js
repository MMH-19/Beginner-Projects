document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const userIdInput = document.getElementById('userid');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-btn');
    const cancelButton = document.getElementById('cancel-btn');
    const messageElement = document.getElementById('message');
    const formContainer = document.querySelector('.container');
    const passwordToggle = document.getElementById('password-toggle');

    // Correct credentials
    const CORRECT_USERID = 'testuser';
    const CORRECT_PASSWORD = 'mypassword';

    // Add input focus effects
    [userIdInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.querySelector('label').style.color = 'var(--primary-color)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.querySelector('label').style.color = 'var(--dark-color)';
        });
    });

    // Function to reset the form
    const resetForm = () => {
        userIdInput.value = '';
        passwordInput.value = '';
        messageElement.textContent = '';
        messageElement.classList.remove('visible');
        
        // Reset background colors with animation
        [userIdInput, passwordInput].forEach(input => {
            // Remove all animation classes
            input.classList.remove('error-animation', 'warning-animation', 'success-animation');
            
            // Reset styles
            input.style.setProperty('background-color', 'var(--input-bg-normal)');
            input.style.setProperty('border', 'var(--input-border-normal)');
            input.style.setProperty('font', 'var(--input-font-normal)');
            
            // Add subtle animation for reset
            input.classList.add('success-animation');
            setTimeout(() => {
                input.classList.remove('success-animation');
            }, 500);
        });
    };

    // Function to show message with animation
    const showMessage = (message, isSuccess = false) => {
        messageElement.textContent = message;
        messageElement.style.color = isSuccess ? 'var(--success-color)' : 'var(--error-color)';
        
        // Reset animation
        messageElement.classList.remove('visible');
        void messageElement.offsetWidth; // Trigger reflow
        
        // Add animation
        messageElement.classList.add('visible');
    };

    // Function to validate login
    const validateLogin = () => {
        const userId = userIdInput.value;
        const password = passwordInput.value;
        let isValid = true;
        let message = '';

        // Reset styles first
        [userIdInput, passwordInput].forEach(input => {
            input.classList.remove('error-animation', 'warning-animation');
            input.style.setProperty('background-color', 'var(--input-bg-normal)');
            input.style.setProperty('border', 'var(--input-border-normal)');
            input.style.setProperty('font', 'var(--input-font-normal)');
        });

        // Check for spaces
        if (userId.includes(' ') || userId === '') {
            userIdInput.style.setProperty('background-color', 'var(--input-bg-warning)');
            userIdInput.classList.add('warning-animation');
            message = 'User ID cannot contain spaces or be empty';
            isValid = false;
        }

        if (password.includes(' ') || password === '') {
            passwordInput.style.setProperty('background-color', 'var(--input-bg-warning)');
            passwordInput.classList.add('warning-animation');
            message = message || 'Password cannot contain spaces or be empty';
            isValid = false;
        }

        // If no spaces, check credentials
        if (isValid) {
            if (userId !== CORRECT_USERID) {
                userIdInput.style.setProperty('background-color', 'var(--input-bg-error)');
                userIdInput.style.setProperty('border', 'var(--input-border-error)');
                userIdInput.style.setProperty('font', 'var(--input-font-error)');
                userIdInput.classList.add('error-animation');
                message = 'Invalid User ID';
                isValid = false;
            }

            if (password !== CORRECT_PASSWORD) {
                passwordInput.style.setProperty('background-color', 'var(--input-bg-error)');
                passwordInput.style.setProperty('border', 'var(--input-border-error)');
                passwordInput.style.setProperty('font', 'var(--input-font-error)');
                passwordInput.classList.add('error-animation');
                message = message || 'Invalid Password';
                isValid = false;
            }
        }

        // If all is valid
        if (isValid) {
            // Success animation on the whole form
            formContainer.classList.add('success-animation');
            setTimeout(() => {
                formContainer.classList.remove('success-animation');
            }, 500);
            
            // Show success message
            showMessage('Login successful!', true);
        } else {
            // Show error message
            showMessage(message, false);
        }

        return isValid;
    };

    // Button animations
    [loginButton, cancelButton].forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-2px)';
        });
    });

    // Event listeners
    loginButton.addEventListener('click', validateLogin);
    cancelButton.addEventListener('click', resetForm);

    // Add key event for enter key
    [userIdInput, passwordInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                validateLogin();
            }
        });
    });

    // Password visibility toggle
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Change icon
        const icon = passwordToggle.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
        
        // Add subtle animation
        passwordInput.classList.add('success-animation');
        setTimeout(() => {
            passwordInput.classList.remove('success-animation');
        }, 300);
    });

    // Initial reset
    resetForm();
}); 