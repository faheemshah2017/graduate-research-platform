// User roles
const ROLES = {
    ADMIN: 'admin',
    STUDENT: 'student',
    FACULTY: 'faculty'
};

// Current user
let currentUser = null;

// Helper function to load dashboard content
function loadDashboardContent(section) {
    let content = '';
    switch(section) {
        case 'home':
            content = `<h2>Welcome, ${currentUser.name}</h2>
                      <p>Role: ${currentUser.role}</p>
                      <p>Department: ${currentUser.department}</p>`;
            break;
        case 'admin':
            if (currentUser.role === ROLES.ADMIN) {
                content = `<h2>Admin Panel</h2>
                           <p>Manage users and settings here</p>`;
            }
            break;
        default:
            content = `<h2>Dashboard</h2>`;
    }
    document.getElementById('dashboard-content').innerHTML = content;
}

// Load sidebar
function loadSidebar() {
    const sidebarContent = `
        <nav id="sidebar" class="bg-light">
            <div class="sidebar-header">
                <h3>${currentUser.name}</h3>
                <p>${currentUser.role} - ${currentUser.department}</p>
            </div>
            <ul class="list-unstyled components">
                <li><a href="#" onclick="loadDashboardContent('home')">Home</a></li>
                ${currentUser.role === ROLES.ADMIN ? '<li><a href="#" onclick="loadDashboardContent(\'admin\')">Admin Panel</a></li>' : ''}
                <li><button class="btn btn-link p-0" onclick="logout()">Logout</button></li>
            </ul>
        </nav>
    `;
    document.getElementById('sidebar-container').innerHTML = sidebarContent;
}

// Initialize dashboard
function initializeDashboard() {
    loadDashboardContent('home');
}

// Load appropriate dashboard based on user role
function loadDashboard() {
    document.getElementById('content-container').innerHTML = `
        <div id="dashboard-content"></div>
    `;
    // Show sidebar only when logged in
    document.getElementById('sidebar-container').style.display = 'block';
    loadSidebar();
    initializeDashboard();
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.getElementById('alert-container') || document.getElementById('content-container');
    container.prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        alertDiv.classList.add('fade');
        setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
}

// Check authentication state
function checkAuthState() {
    const token = localStorage.getItem('grp_token');
    const userData = localStorage.getItem('grp_user');
    // In checkAuthState, only show dashboard/sidebar if a real token is present
    if (token && token !== 'simulated_jwt_token' && userData) {
        currentUser = JSON.parse(userData);
        loadDashboard();
        updateUserUI();
    } else {
        loadLogin();
        updateUserUI();
    }
}

// Login function
async function login(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem('grp_token', data.token); // Use real token from backend
            localStorage.setItem('grp_user', JSON.stringify(data.user));
            loadDashboard();
            updateUserUI();
            return true;
        }
    } catch (err) {
        // Optionally log error
    }
    return false;
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('grp_token');
    localStorage.removeItem('grp_user');
    loadLogin();
    updateUserUI();
}

// Register function
async function register(userData) {
    // Password validation: at least 8 chars
    if (!userData.password || userData.password.length < 8) {
        showAlert('Password must be at least 8 characters long.', 'danger');
        document.getElementById('password').classList.add('is-invalid');
        return null;
    }
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (response.ok) {
            return await response.json();
        } else {
            const err = await response.json();
            showAlert(err.error || 'Registration failed', 'danger');
            return null;
        }
    } catch (err) {
        showAlert('Registration failed', 'danger');
        return null;
    }
}

// Load login page with enhanced validation
function loadLogin() {
    document.getElementById('content-container').innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <h2 class="card-title text-center mb-4">Login</h2>
                        <form id="loginForm" novalidate>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="email" 
                                       placeholder="Enter your email"
                                       required>
                                <div class="invalid-feedback">Please enter a valid email address.</div>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="password" 
                                           placeholder="Enter your password"
                                           required>
                                    <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                        <i class="fas fa-eye-slash"></i>
                                    </button>
                                </div>
                                <div class="invalid-feedback">Please enter your password.</div>
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary">Login</button>
                            </div>
                            <div class="text-center mt-3">
                                <p>Don't have an account? <a href="#" onclick="loadRegister()">Register</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function() {
            const icon = togglePassword.querySelector('i');
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            icon.classList.toggle('fa-eye-slash');
            icon.classList.toggle('fa-eye');
        });
    }

    // Add event listener to login form with validation
    document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = this;
        // Check form validity
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        // Await login and handle result
        const loginResult = await login(email, password);
        if (loginResult) {
            // Navigation is handled in login(), so do not show toast here
        } else {
            showAlert('Invalid email or password', 'danger');
            document.getElementById('email').classList.add('is-invalid');
            document.getElementById('password').classList.add('is-invalid');
        }
    });

    // Add real-time validation for email format
    document.getElementById('email')?.addEventListener('input', function() {
        this.classList.remove('is-invalid');
        if (this.validity.typeMismatch) {
            this.classList.add('is-invalid');
        }
    });

    // Add real-time validation for password
    document.getElementById('password')?.addEventListener('input', function() {
        this.classList.remove('is-invalid');
        if (this.validity.valueMissing) {
            this.classList.add('is-invalid');
        }
    });

    // Hide sidebar when on login page
    if (document.getElementById('sidebar-container')) {
        document.getElementById('sidebar-container').style.display = 'none';
    }
}

// Load register page
function loadRegister() {
    document.getElementById('content-container').innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-20 col-lg-20">
                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <h2 class="card-title text-center mb-4">Register</h2>
                        <form id="registerForm" novalidate>
                            <div class="mb-3">
                                <label for="name" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="name" 
                                       placeholder="Enter your full name"
                                       minlength="3" maxlength="50" required>
                                <div class="invalid-feedback">Please enter a valid name (3-50 characters).</div>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="email" 
                                       placeholder="Enter your email" required>
                                <div class="invalid-feedback">Please enter a valid email address.</div>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="password" 
                                           placeholder="Enter your password"
                                           minlength="8" 
                                           pattern=".{8,}"
                                           title="Password must be at least 8 characters long" 
                                           required>
                                    <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                        <i class="fas fa-eye-slash"></i>
                                    </button>
                                </div>
                                <div class="invalid-feedback">Password must be at least 8 characters long.</div>
                            </div>
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label">Confirm Password</label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="confirmPassword" 
                                           placeholder="Confirm your password" required>
                                    <button class="btn btn-outline-secondary" type="button" id="toggleConfirmPassword">
                                        <i class="fas fa-eye-slash"></i>
                                    </button>
                                </div>
                                <div class="invalid-feedback">Passwords must match.</div>
                            </div>
                            <div class="mb-3">
                                <label for="role" class="form-label">Role</label>
                                <select class="form-select" id="role" required>
                                    <option value="">Select Role</option>
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                </select>
                                <div class="invalid-feedback">Please select a role.</div>
                            </div>
                            <div class="mb-3">
                                <label for="department" class="form-label">Department</label>
                                <select class="form-select" id="department" required>
                                    <option value="">Select Department</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Software Engineering">Software Engineering</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Physics">Physics</option>
                                </select>
                                <div class="invalid-feedback">Please select a department.</div>
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary">Register</button>
                                <button type="button" class="btn btn-outline-secondary" onclick="loadLogin()">Back to Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    [togglePassword, toggleConfirmPassword].forEach((button, index) => {
        button.addEventListener('click', function() {
            const field = index === 0 ? password : confirmPassword;
            const icon = button.querySelector('i');
            const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
            field.setAttribute('type', type);
            icon.classList.toggle('fa-eye-slash');
            icon.classList.toggle('fa-eye');
        });
    });

    // Password confirmation validation
    function validatePasswordConfirmation() {
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords must match");
            confirmPassword.classList.add('is-invalid');
            return false;
        } else {
            confirmPassword.setCustomValidity('');
            confirmPassword.classList.remove('is-invalid');
            return true;
        }
    }

    // Add input event listeners for real-time validation
    password?.addEventListener('input', validatePasswordConfirmation);
    confirmPassword?.addEventListener('input', validatePasswordConfirmation);

    // Add event listener to register form
    document.getElementById('registerForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = this;

        // Validate password confirmation
        if (!validatePasswordConfirmation()) {
            form.classList.add('was-validated');
            return;
        }

        // Use HTML5 form validation API safely
        if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            role: document.getElementById('role').value,
            department: document.getElementById('department').value
        };
        
        const newUser = await register(formData);
        if (newUser) {
            showAlert('Registration successful! Please login.', 'success');
            loadLogin();
        }
    });
}

// Helper to update navbar and sidebar after login/logout
function updateUserUI() {
    if (localStorage.getItem('grp_token') && localStorage.getItem('grp_user')) {
        currentUser = JSON.parse(localStorage.getItem('grp_user'));
        document.getElementById('sidebar-container').style.display = 'block';
        loadSidebar();
        // If you have a navbar with user info, update it here as well
        if (typeof loadNavbar === 'function') loadNavbar();
    } else {
        currentUser = null;
        // Hide sidebar and clear its content
        const sidebar = document.getElementById('sidebar-container');
        if (sidebar) {
            sidebar.style.display = 'none';
            sidebar.innerHTML = '';
        }
        if (typeof loadNavbar === 'function') loadNavbar();
    }
}

// Initialize the app
checkAuthState();