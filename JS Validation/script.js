document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('validationForm');
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordError = document.getElementById('passwordError');
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const submitBtn = document.getElementById('submitBtn');
    const togglePassword = document.getElementById('togglePassword');

    // Validation statuses
    let isPasswordValid = false;
    let isUsernameValid = false;
    let isEmailValid = false;

    // Add password strength indicator
    const createPasswordStrengthIndicator = () => {
        const indicator = document.createElement('div');
        indicator.id = 'passwordStrength';
        indicator.className = 'password-strength mt-1';
        passwordInput.parentNode.insertAdjacentElement('afterend', indicator);
        return indicator;
    };
    const passwordStrength = createPasswordStrengthIndicator();

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Change the icon based on password visibility
        if (type === 'text') {
            togglePassword.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        } else {
            togglePassword.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        }
    });

    // Regular expressions
    // Password: 5 capital letters, 6 symbols, and 2 hyphens in any order
    const passwordRegex = () => {
        const value = passwordInput.value;
        
        // Count occurrences
        const capitalLetters = (value.match(/[A-Z]/g) || []).length;
        const symbols = (value.match(/[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|~`]/g) || []).length;
        const hyphens = (value.match(/-/g) || []).length;
        
        // Update password strength indicator
        updatePasswordStrength(value, capitalLetters, symbols, hyphens);
        
        return (capitalLetters === 5 && symbols === 6 && hyphens === 2);
    };
    
    // Username: only letters without spaces
    const usernameRegex = /^[a-zA-Z]+$/;
    
    // Email: only Gmail addresses
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    // Update password strength indicator
    const updatePasswordStrength = (password, capitalLetters, symbols, hyphens) => {
        // Simple strength calculation based on requirements
        const totalRequired = 13; // 5 capital + 6 symbols + 2 hyphens
        const currentCount = capitalLetters + symbols + hyphens;
        const percentage = Math.min((currentCount / totalRequired) * 100, 100);
        
        // Remove previous classes
        passwordStrength.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
        
        // Add appropriate class based on strength
        if (percentage < 40) {
            passwordStrength.classList.add('strength-weak');
        } else if (percentage < 80) {
            passwordStrength.classList.add('strength-medium');
        } else {
            passwordStrength.classList.add('strength-strong');
        }
    };

    // Validation functions with animations
    const validatePassword = () => {
        isPasswordValid = passwordRegex();
        
        if (!isPasswordValid) {
            passwordError.textContent = 'Password must contain exactly 5 capital letters, 6 symbols, and 2 hyphens.';
            passwordInput.classList.add('input-invalid');
            passwordInput.classList.remove('input-valid');
            
            // Add shake animation
            passwordInput.classList.add('shake');
            setTimeout(() => {
                passwordInput.classList.remove('shake');
            }, 500);
        } else {
            passwordError.textContent = '';
            passwordInput.classList.remove('input-invalid');
            passwordInput.classList.add('input-valid');
            
            // Add success animation with checkmark
            const checkmark = document.createElement('span');
            checkmark.innerHTML = `
                <svg class="checkmark" width="18" height="18" viewBox="0 0 18 18">
                    <path class="checkmark__check" fill="none" stroke="#10b981" stroke-width="2" d="M4 9l3 3 7-7"/>
                </svg>
            `;
            
            // Replace any existing checkmark
            const existingCheckmark = passwordInput.nextElementSibling?.querySelector('.checkmark');
            if (existingCheckmark) {
                existingCheckmark.remove();
            }
            
            // Append new checkmark
            passwordInput.parentNode.appendChild(checkmark);
        }
        
        updateSubmitButton();
    };

    const validateUsername = () => {
        isUsernameValid = usernameRegex.test(usernameInput.value);
        
        if (!isUsernameValid) {
            usernameError.textContent = 'Username must contain only letters without spaces.';
            usernameInput.classList.add('input-invalid');
            usernameInput.classList.remove('input-valid');
            
            // Add shake animation
            usernameInput.classList.add('shake');
            setTimeout(() => {
                usernameInput.classList.remove('shake');
            }, 500);
        } else {
            usernameError.textContent = '';
            usernameInput.classList.remove('input-invalid');
            usernameInput.classList.add('input-valid');
        }
        
        updateSubmitButton();
    };

    const validateEmail = () => {
        isEmailValid = emailRegex.test(emailInput.value);
        
        if (!isEmailValid) {
            emailError.textContent = 'Only Gmail addresses are allowed.';
            emailInput.classList.add('input-invalid');
            emailInput.classList.remove('input-valid');
            
            // Add shake animation
            emailInput.classList.add('shake');
            setTimeout(() => {
                emailInput.classList.remove('shake');
            }, 500);
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('input-invalid');
            emailInput.classList.add('input-valid');
        }
        
        updateSubmitButton();
    };

    // Update submit button state with animation
    const updateSubmitButton = () => {
        const wasDisabled = submitBtn.disabled;
        submitBtn.disabled = !(isPasswordValid && isUsernameValid && isEmailValid);
        
        if (wasDisabled && !submitBtn.disabled) {
            // Button became enabled - add animation
            submitBtn.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                submitBtn.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }
    };

    // Debounce function for input validation to improve performance
    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Event listeners with debounce
    passwordInput.addEventListener('input', debounce(validatePassword, 300));
    usernameInput.addEventListener('input', debounce(validateUsername, 300));
    emailInput.addEventListener('input', debounce(validateEmail, 300));

    // Real-time validation as user types
    passwordInput.addEventListener('focus', () => {
        passwordInput.parentNode.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            passwordInput.parentNode.classList.remove('animate__animated', 'animate__pulse');
        }, 500);
    });

    usernameInput.addEventListener('focus', () => {
        usernameInput.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            usernameInput.classList.remove('animate__animated', 'animate__pulse');
        }, 500);
    });

    emailInput.addEventListener('focus', () => {
        emailInput.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            emailInput.classList.remove('animate__animated', 'animate__pulse');
        }, 500);
    });

    // Form submission with SweetAlert2
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Final validation before submission
        validatePassword();
        validateUsername();
        validateEmail();
        
        if (isPasswordValid && isUsernameValid && isEmailValid) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Form submitted successfully!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                }
            }).then(() => {
                // Reset form after success
                form.reset();
                isPasswordValid = false;
                isUsernameValid = false;
                isEmailValid = false;
                updateSubmitButton();
                
                // Reset validation indicators
                passwordStrength.className = 'password-strength mt-1';
                document.querySelectorAll('.input-valid').forEach(el => el.classList.remove('input-valid'));
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please check your inputs and try again.',
                confirmButtonColor: '#3b82f6'
            });
        }
    });
}); 