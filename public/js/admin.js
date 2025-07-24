// Load navbar
function loadNavbar() {
    const navbarHtml = `
        <nav class="navbar navbar-expand-md navbar-dark bg-dark-green fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="#" onclick="loadDashboard()">GRP</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span class="navbar-toggler-icon"></span>                        
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav me-auto mb-2 mb-md-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#" onclick="loadDashboard()">Home</a>
                        </li>
                    </ul>
                    <div class="d-flex">
                        ${currentUser ? `
                            <div class="dropdown">
                                <button class="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                                    <i class="fas fa-user-circle me-1"></i> ${currentUser.name}
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item" href="#" onclick="loadProfile()">Profile</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
                                </ul>
                            </div>
                        ` : `
                            <a class="btn btn-outline-light me-2" href="#" onclick="loadLogin()">Login</a>
                            <a class="btn btn-light" href="#" onclick="loadRegister()">Register</a>
                        `}
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    document.getElementById('navbar-container').innerHTML = navbarHtml;
}

// Load sidebar based on user role
function loadSidebar() {
    if (!currentUser) return;
    let sidebarHtml = `
        <div class="position-sticky pt-3">
            <div class="text-center mb-4">
                <h6>${currentUser.name}</h6>
                <small class="text-muted">${currentUser.role.toUpperCase()}</small>
            </div>
            <ul class="nav flex-column" id="sidebar-menu">
    `;
    // Common menu items
    sidebarHtml += `
        <li class="nav-item">
            <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadDashboard()">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
        </li>
    `;
    // Admin specific menu
    if (currentUser.role === ROLES.ADMIN) {
        sidebarHtml += `
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadUserManagement()">
                    <i class="fas fa-users-cog"></i> User Management
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadDocumentArchive()">
                    <i class="fas fa-archive"></i> Document Archive
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadReports()">
                    <i class="fas fa-chart-bar"></i> Reports
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadNotifications()">
                    <i class="fas fa-bell"></i> Notifications
                </a>
            </li>
        `;
    }
    // Student specific menu
    if (currentUser.role === ROLES.STUDENT) {
        sidebarHtml += `
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadDocumentSubmission()">
                    <i class="fas fa-file-upload"></i> Document Submission
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadProgressTracking()">
                    <i class="fas fa-tasks"></i> Progress Tracking
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadFeedback()">
                    <i class="fas fa-comment-alt"></i> Feedback
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadGrades()">
                    <i class="fas fa-graduation-cap"></i> Grades
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadChat()">
                    <i class="fas fa-comments"></i> Chat
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadMeetings()">
                    <i class="fas fa-video"></i> Online Meetings
                </a>
            </li>
        `;
    }
    // Faculty specific menu
    if (currentUser.role === ROLES.FACULTY) {
        sidebarHtml += `
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadDocumentReview()">
                    <i class="fas fa-file-alt"></i> Document Review
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadGrading()">
                    <i class="fas fa-check-circle"></i> Grade
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadSearch()">
                    <i class="fas fa-search"></i> Search
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadMeetings()">
                    <i class="fas fa-video"></i> Online Meetings
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="setActiveSidebar(this);loadChat()">
                    <i class="fas fa-comments"></i> Chat
                </a>
            </li>
        `;
    }
    sidebarHtml += `
            </ul>
        </div>
    `;
    document.getElementById('sidebar-container').innerHTML = sidebarHtml;
}

// Helper to set active sidebar item
function setActiveSidebar(element) {
    document.querySelectorAll('#sidebar-menu .nav-link').forEach(link => link.classList.remove('active'));
    element.classList.add('active');
}

// Initialize dashboard
function initializeDashboard() {
    if (!currentUser) return;
    
    let dashboardHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Dashboard</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <div class="btn-group me-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
                </div>
                <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                    <span data-feather="calendar"></span>
                    This week
                </button>
            </div>
        </div>
        
        <div id="alert-container"></div>
        
        <div class="row mb-4">
    `;
    
    // Admin dashboard
    if (currentUser.role === ROLES.ADMIN) {
        dashboardHtml += `
            <div class="col-md-3">
                <div class="dashboard-tile tile-primary">
                    <h3><i class="fas fa-users"></i> 42</h3>
                    <p>Total Users</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-tile tile-success">
                    <h3><i class="fas fa-file-alt"></i> 128</h3>
                    <p>Documents Submitted</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-tile tile-warning">
                    <h3><i class="fas fa-clock"></i> 15</h3>
                    <p>Pending Reviews</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-tile tile-info">
                    <h3><i class="fas fa-bell"></i> 7</h3>
                    <p>New Notifications</p>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-60">
                <div class="card">
            <div class="col-md-70">
                <div class="card">
                    <div class="card-header">
                        Quick Actions
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" onclick="loadUserManagement()">
                                <i class="fas fa-user-plus me-2"></i> Add New User
                            </button>
                            <button class="btn btn-success" onclick="loadDocumentArchive()">
                                <i class="fas fa-archive me-2"></i> Archive Documents
                            </button>
                            <button class="btn btn-info" onclick="loadReports()">
                                <i class="fas fa-chart-pie me-2"></i> Generate Reports
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    
    // Student dashboard
    if (currentUser.role === ROLES.STUDENT) {
        // Fetch student analytics from backend and render dashboard tiles
        fetch(`/api/student/analytics?studentId=${currentUser._id}`)
            .then(res => res.json())
            .then(analytics => {
                dashboardHtml += `
                    <div class="col-md-3">
                        <div class="dashboard-tile tile-primary">
                            <h3><i class="fas fa-file-upload"></i> ${analytics.documentsSubmitted}</h3>
                            <p>Documents Submitted</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="dashboard-tile tile-success">
                            <h3><i class="fas fa-check-circle"></i> ${analytics.approvedDocuments}</h3>
                            <p>Approved Documents</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="dashboard-tile tile-warning">
                            <h3><i class="fas fa-clock"></i> ${analytics.pendingReviews}</h3>
                            <p>Pending Reviews</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="dashboard-tile tile-info">
                            <h3><i class="fas fa-comment-alt"></i> ${analytics.feedbackReceived}</h3>
                            <p>Feedback Received</p>
                        </div>
                    </div>
                </div>
                <div class="row">                
                    <div class="col-md-60">
                        <div class="card">
                            <div class="card-header">Quick Actions</div>
                            <div class="card-body">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary" onclick="loadFeedback()">
                                        <i class="fas fa-file-signature me-2"></i>Check Feedback
                                    </button>
                                    <button class="btn btn-success" onclick="loadGrades()">
                                        <i class="fas fa-check-double me-2"></i> Check Grades
                                    </button>
                                    <button class="btn btn-info" onclick="loadMeetings()">
                                        <i class="fas fa-search me-2"></i>Start online Meeting
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                document.getElementById('content-container').innerHTML = dashboardHtml;
            });
        return;
    }
    
    // Faculty dashboard
    if (currentUser.role === ROLES.FACULTY) {
        // Pass current user id to fetch analytics
        fetch(`/api/faculty/analytics?facultyId=${currentUser._id}`)
            .then(res => res.json())
            .then(analytics => {
                dashboardHtml += `
                    <div class="col-md-3">
                        <div class="dashboard-tile tile-primary">
                            <h3><i class="fas fa-file-alt"></i> ${analytics.documentsToReview}</h3>
                            <p>Documents to Review</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="dashboard-tile tile-success">
                            <h3><i class="fas fa-check-circle"></i> ${analytics.reviewsCompleted}</h3>
                            <p>Reviews Completed</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="dashboard-tile tile-warning">
                            <h3><i class="fas fa-clock"></i> ${analytics.pendingMeetings}</h3>
                            <p>Pending Meetings</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="dashboard-tile tile-info">
                            <h3><i class="fas fa-comments"></i> ${analytics.unreadMessages}</h3>
                            <p>Unread Messages</p>
                        </div>
                    </div>
                </div>
                <div class="row">                
                    <div class="col-md-60">
                        <div class="card">
                            <div class="card-header">Quick Actions</div>
                            <div class="card-body">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary" onclick="loadDocumentReview()">
                                        <i class="fas fa-file-signature me-2"></i> Review Documents
                                    </button>
                                    <button class="btn btn-success" onclick="loadGrading()">
                                        <i class="fas fa-check-double me-2"></i> Assign Grades
                                    </button>
                                    <button class="btn btn-info" onclick="loadSearch()">
                                        <i class="fas fa-search me-2"></i> Search Documents
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                document.getElementById('content-container').innerHTML = dashboardHtml;
            });
        return;
    }
    
    document.getElementById('content-container').innerHTML = dashboardHtml;
}

// Load user profile page
function loadProfile() {
    if (!currentUser) return;
    const profileHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">My Profile</h1>
        </div>
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <img src="${currentUser.photo ? '/uploads/' + currentUser.photo : 'https://via.placeholder.com/150'}" class="rounded-circle mb-3" alt="Profile Picture" id="profilePhotoPreview" style="width:150px;height:150px;object-fit:cover;">
                        <input type="file" id="profilePhotoInput" accept="image/*" class="form-control mb-2">
                        <h5>${currentUser.name}</h5>
                        <p class="text-muted">${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Profile Information</div>
                    <div class="card-body">
                        <form id="profileForm">
                            <div class="mb-3">
                                <label for="name" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="name" value="${currentUser.name}">
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" value="${currentUser.email}" readonly>
                            </div>
                            <div class="mb-3">
                                <label for="department" class="form-label">Department</label>
                                <input type="text" class="form-control" id="department" value="${currentUser.department || ''}">
                            </div>
                            ${currentUser.role === ROLES.STUDENT ? `
                                <div class="mb-3">
                                    <label for="advisor" class="form-label">Advisor</label>
                                    <input type="text" class="form-control" id="advisor" value="${currentUser.advisor || ''}">
                                </div>
                            ` : ''}
                            <div class="mb-3">
                                <label for="password" class="form-label">New Password</label>
                                <input type="password" class="form-control" id="password" placeholder="Leave blank to keep current">
                            </div>
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" id="confirmPassword">
                            </div>
                            <button type="submit" class="btn btn-primary">Update Profile</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('content-container').innerHTML = profileHtml;
    // Preview selected photo
    document.getElementById('profilePhotoInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                document.getElementById('profilePhotoPreview').src = ev.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    // Add form submit handler
    document.getElementById('profileForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('department', document.getElementById('department').value);
        if (document.getElementById('advisor')) {
            formData.append('advisor', document.getElementById('advisor').value);
        }
        if (document.getElementById('profilePhotoInput').files[0]) {
            formData.append('photo', document.getElementById('profilePhotoInput').files[0]);
        }
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password) {
            if (password !== confirmPassword) {
                showAlert('Passwords do not match!', 'danger');
                return;
            }
            formData.append('password', password);
        }
        // Add user id to formData for backend
        formData.append('_id', currentUser._id);
        try {
            const res = await fetch(`/api/users/update-profile`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const updated = await res.json();
                localStorage.setItem('grp_user', JSON.stringify(updated.user));
                showAlert('Profile updated successfully!', 'success');
                loadProfile();
            } else {
                const err = await res.json();
                showAlert(err.error || 'Profile update failed', 'danger');
            }
        } catch {
            showAlert('Profile update failed', 'danger');
        }
    });
}

// Load user management page (Admin only)
async function loadUserManagement() {
    if (!currentUser || currentUser.role !== ROLES.ADMIN) return;
    // Fetch users from backend
    let users = [];
    try {
        const res = await fetch('/api/users');
        users = await res.json();
    } catch {
        showAlert('Failed to load users from server', 'danger');
        users = [];
    }
    const userManagementHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">User Management</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <button class="btn btn-sm btn-primary" onclick="loadAddUserPage()">
                    <i class="fas fa-user-plus me-1"></i> Add New User
                </button>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-6">
                        <h5>All Users</h5>
                    </div>
                    <div class="col-md-6">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Search users..." id="userSearch">
                            <button class="btn btn-outline-secondary" type="button" onclick="searchUsers()">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => `
                                <tr>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                                    <td>${user.department || '-'}</td>
                                    <td><span class="badge bg-success">Active</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="editUser('${user._id}')">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger" onclick="confirmDeleteUser('${user._id}')">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    document.getElementById('content-container').innerHTML = userManagementHtml;
}

// Load the add user form (full page)
function loadAddUserForm() {
    const addUserHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Create New User Account</h1>
            <button class="btn btn-sm btn-outline-secondary" onclick="loadUserManagement()">
                <i class="fas fa-arrow-left me-1"></i> Back to Users
            </button>
        </div>
        
        <div class="row">
            <div class="col-md-8 mx-auto">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">User Registration Form</h5>
                    </div>
                    <div class="card-body">
                        <form id="addUserForm" onsubmit="submitUserForm(event)">
                            <div class="row g-3">
                                <!-- Personal Information -->
                                <div class="col-md-6">
                                    <label for="userName" class="form-label">Full Name*</label>
                                    <input type="text" class="form-control" id="userName" required>
                                </div>
                                
                                <div class="col-md-6">
                                    <label for="userEmail" class="form-label">Email Address*</label>
                                    <input type="email" class="form-control" id="userEmail" required>
                                </div>
                                
                                <!-- Account Type -->
                                <div class="col-md-6">
                                    <label for="userRole" class="form-label">User Role*</label>
                                    <select class="form-select" id="userRole" required onchange="toggleRoleFields()">
                                        <option value="">Select Role</option>
                                        <option value="admin">Administrator</option>
                                        <option value="faculty">Faculty/Teacher</option>
                                        <option value="student">Student</option>
                                    </select>
                                </div>
                                
                                <div class="col-md-6">
                                    <label for="userDepartment" class="form-label">Department*</label>
                                    <select class="form-select" id="userDepartment" required>
                                        <option value="">Select Department</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Software Engineering">Software Engineering</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Physics">Physics</option>
                                    </select>
                                </div>
                                
                                <!-- Student-specific fields (hidden by default) -->
                                <div id="studentFields" class="row g-3 d-none">
                                    <div class="col-md-6">
                                        <label for="studentId" class="form-label">Student ID</label>
                                        <input type="text" class="form-control" id="studentId">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="enrollmentDate" class="form-label">Enrollment Date</label>
                                        <input type="date" class="form-control" id="enrollmentDate">
                                    </div>
                                </div>
                                
                                <!-- Faculty-specific fields (hidden by default) -->
                                <div id="facultyFields" class="row g-3 d-none">
                                    <div class="col-md-6">
                                        <label for="facultyPosition" class="form-label">Position</label>
                                        <input type="text" class="form-control" id="facultyPosition">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="facultyOffice" class="form-label">Office Location</label>
                                        <input type="text" class="form-control" id="facultyOffice">
                                    </div>
                                </div>
                                
                                <!-- Password Section -->
                                <div class="col-md-6">
                                    <label for="userPassword" class="form-label">Password*</label>
                                    <input type="password" class="form-control" id="userPassword" required minlength="8">
                                    <div class="form-text">At least 8 characters</div>
                                </div>
                                
                                <div class="col-md-6">
                                    <label for="confirmPassword" class="form-label">Confirm Password*</label>
                                    <input type="password" class="form-control" id="confirmPassword" required>
                                </div>
                                
                                <!-- Account Status -->
                                <div class="col-12">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="userActive" checked>
                                        <label class="form-check-label" for="userActive">Account Active</label>
                                    </div>
                                </div>
                                
                                <!-- Notification Options -->
                                <div class="col-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="sendWelcomeEmail">
                                        <label class="form-check-label" for="sendWelcomeEmail">
                                            Send welcome email with login instructions
                                        </label>
                                    </div>
                                </div>
                                
                                <!-- Form Actions -->
                                <div class="col-12 mt-4">
                                    <button type="submit" class="btn btn-primary me-2">
                                        <i class="fas fa-save me-1"></i> Create User
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary" onclick="loadUserManagement()">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-container').innerHTML = addUserHtml;
}

// Show/hide role-specific fields
function toggleRoleFields() {
    // Get the role select element and its value
    const roleSelect = document.getElementById('userRole');
    if (!roleSelect) {
        console.error('Role select element not found');
        return;
    }
    
    const role = roleSelect.value;
    
    // Get the field containers
    const studentFields = document.getElementById('studentFields');
    const facultyFields = document.getElementById('facultyFields');
    
    // Check if elements exist before manipulating them
    if (!studentFields || !facultyFields) {
        console.error('Role-specific fields not found in DOM');
        return;
    }
    
    // Hide all fields first
    studentFields.classList.add('d-none');
    facultyFields.classList.add('d-none');
    
    // Show relevant fields based on selected role
    if (role === 'student') {
        studentFields.classList.remove('d-none');
    } else if (role === 'faculty') {
        facultyFields.classList.remove('d-none');
    }
    // Note: No action needed for 'admin' role as both fields should remain hidden
}
// Handle form submission
function submitUserForm(event) {
    event.preventDefault();
    
    // Get form values
    const userData = {
        name: document.getElementById('userName').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        role: document.getElementById('userRole').value,
        department: document.getElementById('userDepartment').value,
        password: document.getElementById('userPassword').value,
        active: document.getElementById('userActive').checked,
        sendEmail: document.getElementById('sendWelcomeEmail').checked
    };
    
    // Validate passwords match
    if (userData.password !== document.getElementById('confirmPassword').value) {
        showAlert('Passwords do not match', 'danger');
        return;
    }
    
    // Validate email format
    if (!validateEmail(userData.email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        showAlert('A user with this email already exists', 'danger');
        return;
    }
    
    // Add role-specific data
    if (userData.role === 'student') {
        userData.studentId = document.getElementById('studentId').value;
        userData.enrollmentDate = document.getElementById('enrollmentDate').value;
    } else if (userData.role === 'faculty') {
        userData.position = document.getElementById('facultyPosition').value;
        userData.office = document.getElementById('facultyOffice').value;
    }
    
    // Create user object (in real app, this would be an API call)
    const newUser = {
        id: generateUserId(),
        ...userData,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    
    // Add to users array
    users.push(newUser);
    
    // Show success message
    showAlert(`Successfully created ${userData.role} account for ${userData.name}`, 'success');
    
    // If send email was checked, simulate sending
    if (userData.sendEmail) {
        console.log(`Sending welcome email to ${userData.email}`);
    }
    
    // Return to user management after delay
    setTimeout(() => loadUserManagement(), 1500);
}

// Helper functions
function generateUserId() {
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRoleBadgeClass(role) {
    switch(role) {
        case 'admin': return 'bg-danger';
        case 'faculty': return 'bg-primary';
        case 'student': return 'bg-success';
        default: return 'bg-secondary';
    }
}

function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const rows = document.querySelectorAll('table tbody tr');
    
    rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(searchTerm) ? '' : 'none';
    });
}

function confirmDeleteUser(userId) {
    if (confirm('Are you sure you want to delete this user account?')) {
        deleteUser(userId);
    }
}

function deleteUser(userId) {
    users = users.filter(user => user.id !== userId);
    showAlert('User account deleted', 'success');
    loadUserManagement();
}

function editUser(userId) {
    // Implementation for edit functionality
    const user = users.find(u => u.id === userId);
    if (user) {
        showAlert(`Edit functionality would open for ${user.name}`, 'info');
    }
}
//edit user
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const editUserModalHtml = `
        <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editUserModalLabel">Edit User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editUserForm">
                            <div class="mb-3">
                                <label for="editUserName" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="editUserName" value="${user.name}" required>
                            </div>
                            <div class="mb-3">
                                <label for="editUserEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="editUserEmail" value="${user.email}" required>
                            </div>
                            <div class="mb-3">
                                <label for="editUserRole" class="form-label">Role</label>
                                <select class="form-select" id="editUserRole" required>
                                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                                    <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                                    <option value="faculty" ${user.role === 'faculty' ? 'selected' : ''}>Faculty</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="editUserDepartment" class="form-label">Department</label>
                                <input type="text" class="form-control" id="editUserDepartment" value="${user.department || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="editUserPassword" class="form-label">New Password (leave blank to keep current)</label>
                                <input type="password" class="form-control" id="editUserPassword">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="submitEditUserForm(${user.id})">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Create modal element
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = editUserModalHtml;
    document.body.appendChild(modalDiv);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();

    // Remove modal from DOM after it's hidden
    document.getElementById('editUserModal').addEventListener('hidden.bs.modal', function() {
        modalDiv.remove();
    });
}

// Submit edit user form
function submitEditUserForm(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const name = document.getElementById('editUserName').value;
    const email = document.getElementById('editUserEmail').value;
    const role = document.getElementById('editUserRole').value;
    const department = document.getElementById('editUserDepartment').value;
    const newPassword = document.getElementById('editUserPassword').value;

    // Basic validation
    if (!name || !email || !role || !department) {
        showAlert('Please fill all required fields', 'danger');
        return;
    }

    // Update user data
    user.name = name;
    user.email = email;
    user.role = role;
    user.department = department;

    // Update password if provided
    if (newPassword) {
        user.password = newPassword;
    }

    // Close modal and refresh
    bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
    showAlert('User updated successfully!', 'success');
    loadUserManagement();
}

// Delete user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        // In a real app, you would make an API call to delete the user
        users = users.filter(u => u.id !== userId);
        showAlert('User deleted successfully!', 'success');
        loadUserManagement();
    }
}

// Load document archive
function loadDocumentArchive() {
    const archiveHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Document Archive</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <div class="btn-group me-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="exportArchive()">Export</button>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-6">
                        <h5>Archived Documents</h5>
                    </div>
                    <div class="col-md-6">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Search documents..." id="archiveSearch">
                            <button class="btn btn-outline-secondary" type="button" onclick="searchArchive()">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Type</th>
                                <th>Department</th>
                                <th>Date Archived</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="archiveTableBody">
                            <!-- Documents will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-container').innerHTML = archiveHtml;
    
    // Load documents
    loadArchiveDocuments();
}

// Load documents into the table
function loadArchiveDocuments() {
    // Sample data - in real app this would come from an API
    const documents = [
        {
            id: 'doc001',
            title: 'Machine Learning Research Proposal',
            author: 'John Doe',
            type: 'Proposal',
            department: 'Computer Science',
            date: '15 Jan 2023',
            filename: 'ml_research_proposal.pdf',
            url: '/documents/archives/ml_research_proposal.pdf'
        },
        {
            id: 'doc002',
            title: 'Data Analysis Progress Report',
            author: 'Jane Smith',
            type: 'Progress Report',
            department: 'Data Science',
            date: '20 Feb 2023',
            filename: 'data_analysis_report.docx',
            url: '/documents/archives/data_analysis_report.docx'
        },
        {
            id: 'doc003',
            title: 'Thesis Final Draft',
            author: 'Alex Johnson',
            type: 'Thesis',
            department: 'Engineering',
            date: '10 Mar 2023',
            filename: 'thesis_final.pdf',
            url: '/documents/archives/thesis_final.pdf'
        }
    ];

    const tableBody = document.getElementById('archiveTableBody');
    tableBody.innerHTML = '';

    documents.forEach(doc => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${doc.title}</td>
            <td>${doc.author}</td>
            <td>${doc.type}</td>
            <td>${doc.department}</td>
            <td>${doc.date}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="downloadDocument('${doc.id}', '${doc.filename}')">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="btn btn-sm btn-outline-info" onclick="viewDocument('${doc.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Download document function
function downloadDocument(docId, filename) {
    // In a real app, this would fetch from your API
    console.log(`Downloading document ${docId}: ${filename}`);
    
    // Simulate download (replace with actual API call)
    const link = document.createElement('a');
    link.href = `/api/documents/download/${docId}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track download in your analytics
    trackDocumentAction('download', docId);
}

// View document function
function viewDocument(docId) {
    // In a real app, this would fetch from your API
    console.log(`Viewing document ${docId}`);
    
    // Open in a new tab with your document viewer
    window.open(`/document-viewer.html?id=${docId}`, '_blank');
    
    // Track view in your analytics
    trackDocumentAction('view', docId);
}

// Search archive function
function searchArchive() {
    const searchTerm = document.getElementById('archiveSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#archiveTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Export archive function
function exportArchive() {
    console.log('Exporting archive...');
    // In a real app, this would generate and download a report
    alert('Export functionality would generate a report file');
}

// Track document actions (optional)
function trackDocumentAction(action, docId) {
    console.log(`Document ${action}ed: ${docId}`);
    // In a real app, you would send this to your analytics service
    // fetch('/api/analytics/document-action', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ action, docId })
    // });
}

// Load reports with full export functionality
function loadReports() {
    // Sample data - in a real app, this would come from your database
    const reportData = [
        {
            name: "John Doe",
            regNumber: "CS2023001",
            projectTitle: "Machine Learning for Image Recognition",
            supervisor: "Dr. Smith",
            department: "Computer Science",
            status: "In Progress",
            lastSubmission: "2023-05-15"
        },
        {
            name: "Jane Smith",
            regNumber: "DS2023002",
            projectTitle: "Big Data Analysis in Healthcare",
            supervisor: "Dr. Johnson",
            department: "Data Science",
            status: "Completed",
            lastSubmission: "2023-04-20"
        },
        {
            name: "Mike Johnson",
            regNumber: "IT2023003",
            projectTitle: "Blockchain for Secure Voting Systems",
            supervisor: "Dr. Williams",
            department: "Information Technology",
            status: "In Progress",
            lastSubmission: "2023-05-10"
        }
    ];

    const reportsHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Student Research Reports</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="exportDropdown" data-bs-toggle="dropdown">
                        <i class="fas fa-download me-1"></i> Export
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="exportToCSV()"><i class="fas fa-file-csv me-2"></i> CSV</a></li>
                        <li><a class="dropdown-item" href="#" onclick="exportToExcel()"><i class="fas fa-file-excel me-2"></i> Excel</a></li>
                        <li><a class="dropdown-item" href="#" onclick="exportToPDF()"><i class="fas fa-file-pdf me-2"></i> PDF</a></li>
                    </ul>
                </div>
                <button type="button" class="btn btn-sm btn-outline-secondary ms-2" onclick="printReport()">
                    <i class="fas fa-print me-1"></i> Print
                </button>
            </div>
        </div>
        
        <div class="row mb-3">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-md-6">
                                <h5>Filter Reports</h5>
                            </div>
                            <div class="col-md-6">
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="Search students..." id="reportSearch">
                                    <button class="btn btn-outline-secondary" type="button" id="searchButton">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="reportFilterForm">
                            <div class="row g-3">
                                <div class="col-md-3">
                                    <label for="departmentFilter" class="form-label">Department</label>
                                    <select class="form-select" id="departmentFilter">
                                        <option value="all">All Departments</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Data Science">Data Science</option>
                                        <option value="Information Technology">Information Technology</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label for="statusFilter" class="form-label">Status</label>
                                    <select class="form-select" id="statusFilter">
                                        <option value="all">All Statuses</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label for="supervisorFilter" class="form-label">Supervisor</label>
                                    <select class="form-select" id="supervisorFilter">
                                        <option value="all">All Supervisors</option>
                                        <option value="Dr. Smith">Dr. Smith</option>
                                        <option value="Dr. Johnson">Dr. Johnson</option>
                                        <option value="Dr. Williams">Dr. Williams</option>
                                    </select>
                                </div>
                                <div class="col-md-3 d-flex align-items-end">
                                    <button type="submit" class="btn btn-primary w-100">
                                        <i class="fas fa-filter me-1"></i> Apply Filters
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>Student Research Projects</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover" id="reportsTable">
                        <thead class="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Student Name</th>
                                <th>Registration No.</th>
                                <th>Project Title</th>
                                <th>Supervisor</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Last Submission</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.map((student, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${student.name}</td>
                                    <td>${student.regNumber}</td>
                                    <td>${student.projectTitle}</td>
                                    <td>${student.supervisor}</td>
                                    <td>${student.department}</td>
                                    <td>
                                        <span class="badge ${student.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'}">
                                            ${student.status}
                                        </span>
                                    </td>
                                    <td>${student.lastSubmission}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Added /print buttons at the end of the table -->
                <div class="d-flex justify-content-end mt-3">
                    <div class="btn-group">
                        <button type="button" class="btn btn-secondary" onclick="printReport()">
                            <i class="fas fa-print me-2"></i> Print Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-container').innerHTML = reportsHtml;
    
    // Initialize filter functionality
    document.getElementById('reportFilterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        filterReports();
    });
    
    document.getElementById('searchButton').addEventListener('click', filterReports);
}

// Filter reports based on user selection
function filterReports() {
    const department = document.getElementById('departmentFilter').value;
    const status = document.getElementById('statusFilter').value;
    const supervisor = document.getElementById('supervisorFilter').value;
    const searchTerm = document.getElementById('reportSearch').value.toLowerCase();
    
    const rows = document.querySelectorAll('#reportsTable tbody tr');
    
    rows.forEach(row => {
        const rowDept = row.cells[5].textContent;
        const rowStatus = row.cells[6].textContent.trim();
        const rowSupervisor = row.cells[4].textContent;
        const rowText = row.textContent.toLowerCase();
        
        const deptMatch = department === 'all' || rowDept === department;
        const statusMatch = status === 'all' || rowStatus === status;
        const supervisorMatch = supervisor === 'all' || rowSupervisor === supervisor;
        const searchMatch = rowText.includes(searchTerm);
        
        row.style.display = (deptMatch && statusMatch && supervisorMatch && searchMatch) ? '' : 'none';
    });
}

// Export to CSV function
function exportToCSV() {
    const table = document.getElementById('reportsTable');
    const rows = table.querySelectorAll('tr');
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    const headers = [];
    table.querySelectorAll('thead th').forEach(header => {
        headers.push(`"${header.textContent.trim()}"`);
    });
    csvContent += headers.join(',') + '\r\n';
    
    // Add data rows
    rows.forEach((row, rowIndex) => {
        if (rowIndex > 0 && row.style.display !== 'none') { // Skip header row and hidden rows
            const rowData = [];
            row.querySelectorAll('td').forEach(cell => {
                rowData.push(`"${cell.textContent.trim()}"`);
            });
            csvContent += rowData.join(',') + '\r\n';
        }
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_research_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Export to Excel (using SheetJS library)
function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        showAlert('Excel export library not loaded. Please try again.', 'danger');
        return;
    }
    
    const table = document.getElementById('reportsTable');
    const rows = Array.from(table.querySelectorAll('tr')).filter(row => 
        row.querySelector('th') || row.style.display !== 'none'
    );
    
    // Create a new table with only visible rows
    const tempTable = document.createElement('table');
    const tempThead = document.createElement('thead');
    const tempTbody = document.createElement('tbody');
    
    // Add headers
    const headerRow = document.createElement('tr');
    table.querySelectorAll('thead th').forEach(th => {
        const newTh = document.createElement('th');
        newTh.textContent = th.textContent;
        headerRow.appendChild(newTh);
    });
    tempThead.appendChild(headerRow);
    tempTable.appendChild(tempThead);
    
    // Add visible data rows
    rows.forEach((row, rowIndex) => {
        if (rowIndex > 0) { // Skip header row
            const newRow = document.createElement('tr');
            row.querySelectorAll('td').forEach(cell => {
                const newCell = document.createElement('td');
                newCell.textContent = cell.textContent;
                newRow.appendChild(newCell);
            });
            tempTbody.appendChild(newRow);
        }
    });
    tempTable.appendChild(tempTbody);
    
    // Convert to workbook and export
    const workbook = XLSX.utils.table_to_book(tempTable, {sheet: "Student Research"});
    XLSX.writeFile(workbook, `student_research_${new Date().toISOString().slice(0,10)}.xlsx`);
}

// Export to PDF (using jsPDF library)
function exportToPDF() {
    if (typeof jsPDF === 'undefined') {
        showAlert('PDF export library not loaded. Please try again.', 'danger');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    
    // Add title
    doc.setFontSize(16);
    doc.text('Student Research Report', 14, 12);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 18);
    
    // Get table data (only visible rows)
    const table = document.getElementById('reportsTable');
    const headers = [];
    const data = [];
    
    // Process headers
    table.querySelectorAll('thead th').forEach(header => {
        headers.push(header.textContent.trim());
    });
    
    // Process rows (only visible ones)
    table.querySelectorAll('tbody tr').forEach(row => {
        if (row.style.display !== 'none') {
            const rowData = [];
            row.querySelectorAll('td').forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
            data.push(rowData);
        }
    });
    
    // Generate PDF
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 25,
        margin: { horizontal: 10 },
        styles: {
            fontSize: 8,
            cellPadding: 3,
            valign: 'middle',
            halign: 'left'
        },
        columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
            3: { cellWidth: 40 },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 },
            6: { cellWidth: 20 },
            7: { cellWidth: 20 }
        }
    });
    
    doc.save(`student_research_${new Date().toISOString().slice(0,10)}.pdf`);
}

// Print report function
function printReport() {
    const printWindow = window.open('', '_blank');
    const table = document.getElementById('reportsTable');
    
    // Create printable content
    const printableContent = `
        <html>
            <head>
                <title>Student Research Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #006400; text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background-color: #006400; color: white; padding: 8px; text-align: left; }
                    td { padding: 8px; border-bottom: 1px solid #ddd; }
                    .badge { padding: 3px 6px; border-radius: 4px; font-size: 12px; }
                    .bg-success { background-color: #28a745; color: white; }
                    .bg-warning { background-color: #ffc107; color: black; }
                    @page { size: auto; margin: 10mm; }
                    @media print {
                        body { margin: 0; padding: 0; }
                        table { width: 100% !important; }
                    }
                </style>
            </head>
            <body>
                <h1>Student Research Report</h1>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
                ${table.outerHTML}
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 200);
                    };
                </script>
            </body>
        </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printableContent);
    printWindow.document.close();
}

// Load notifications
function loadNotifications() {
    const notificationsHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Notifications</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <button class="btn btn-sm btn-primary" onclick="showSendNotificationModal()">
                    <i class="fas fa-paper-plane me-1"></i> Send Notification
                </button>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>Recent Notifications</h5>
            </div>
            <div class="card-body">
                <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">Final Thesis Submission Reminder</h6>
                            <small>Today, 10:30 AM</small>
                        </div>
                        <p class="mb-1">Reminder: Final thesis submissions are due on May 15th.</p>
                        <small>Sent to: All Students</small>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">System Maintenance</h6>
                            <small>Yesterday, 5:00 PM</small>
                        </div>
                        <p class="mb-1">The system will be down for maintenance on Saturday from 2-4 AM.</p>
                        <small>Sent to: All Users</small>
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Send Notification Modal -->
        <div class="modal fade" id="sendNotificationModal" tabindex="-1" aria-labelledby="sendNotificationModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="sendNotificationModalLabel">Send Notification</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="notificationForm">
                            <div class="mb-3">
                                <label for="notificationRecipients" class="form-label">Recipients</label>
                                <select class="form-select" id="notificationRecipients" multiple>
                                    <option value="all">All Users</option>
                                    <option value="students">All Students</option>
                                    <option value="faculty">All Faculty</option>
                                    <option value="admins">All Admins</option>
                                    <option value="cs">Computer Science Department</option>
                                    <option value="ds">Data Science Department</option>
                                </select>
                                <small class="text-muted">Hold Ctrl/Cmd to select multiple options</small>
                            </div>
                            <div class="mb-3">
                                <label for="notificationSubject" class="form-label">Subject</label>
                                <input type="text" class="form-control" id="notificationSubject" required>
                            </div>
                            <div class="mb-3">
                                <label for="notificationMessage" class="form-label">Message</label>
                                <textarea class="form-control" id="notificationMessage" rows="5" required></textarea>
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="sendEmail">
                                    <label class="form-check-label" for="sendEmail">
                                        Also send as email
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="submitNotificationForm()">Send Notification</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-container').innerHTML = notificationsHtml;
}

// Show send notification modal
function showSendNotificationModal() {
    const modal = new bootstrap.Modal(document.getElementById('sendNotificationModal'));
    modal.show();
}

// Submit notification form
function submitNotificationForm() {
    const recipients = Array.from(document.getElementById('notificationRecipients').selectedOptions)
        .map(option => option.value);
    const subject = document.getElementById('notificationSubject').value;
    const message = document.getElementById('notificationMessage').value;
    const sendEmail = document.getElementById('sendEmail').checked;

    if (!recipients.length || !subject || !message) {
        showAlert('Please fill all required fields', 'danger');
        return;
    }

    // In a real app, you would send this data to the server
    console.log('Notification to be sent:', { recipients, subject, message, sendEmail });

    // Close modal and show success
    bootstrap.Modal.getInstance(document.getElementById('sendNotificationModal')).hide();
    showAlert('Notification sent successfully!', 'success');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
    checkAuthState();
});


// Load User Management Dashboard
function loadUserManagement() {
    const html = `
        <div class="container-fluid" style="margin-top: 60px;">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">

            <h1 class="h2">User Management</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <button class="btn btn-primary" onclick="loadAddUserForm()">
                    <i class="fas fa-user-plus me-1"></i> Add New User
                </button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-6">
                        <h5>All Users</h5>
                    </div>
                    <div class="col-md-6">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Search users..." id="userSearch">
                            <button class="btn btn-outline-secondary" type="button" onclick="searchUsers()">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                            ${users.map(user => `
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td><span class="badge ${getRoleBadgeClass(user.role)}">${capitalizeFirstLetter(user.role)}</span></td>
                                    <td>${user.department}</td>
                                    <td><span class="badge ${user.active ? 'bg-success' : 'bg-secondary'}">${user.active ? 'Active' : 'Inactive'}</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editUser(${user.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger" onclick="confirmDeleteUser(${user.id})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.getElementById('content-container').innerHTML = html;
}

// Load Add New User Form (Registration Form)
function loadAddUserForm() {
    const html = `
    <div class="container-fluid" style="margin-top: 60px;">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Add New User</h1>
            <button class="btn btn-outline-secondary" onclick="loadUserManagement()">
                <i class="fas fa-arrow-left me-1"></i> Back to Users
            </button>
        </div>

        <div class="card">
            <div class="card-header">
                <h5>User Registration Form</h5>
            </div>
            <div class="card-body">
                <form id="addUserForm">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="firstName" class="form-label">First Name</label>
                            <input type="text" class="form-control" id="firstName" required>
                        </div>
                        <div class="col-md-6">
                            <label for="lastName" class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="lastName" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email Address</label>
                        <input type="email" class="form-control" id="email" required>
                    </div>

                    <div class="mb-3">
                        <label for="role" class="form-label">User Role</label>
                        <select class="form-select" id="role" required onchange="toggleRoleFields()">
                            <option value="">Select Role</option>
                            <option value="admin">Administrator</option>
                            <option value="faculty">Faculty</option>
                            <option value="student">Student</option>
                        </select>
                    </div>

                    <div class="mb-3" id="departmentField">
                        <label for="department" class="form-label">Department</label>
                        <select class="form-select" id="department">
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                        </select>
                    </div>

                    <div class="mb-3 d-none" id="studentIdField">
                        <label for="studentId" class="form-label">Student ID</label>
                        <input type="text" class="form-control" id="studentId">
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <div class="input-group">
                            <input type="password" class="form-control" id="password" required minlength="8">
                            <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <div class="form-text">Password must be at least 8 characters</div>
                    </div>

                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="confirmPassword" required>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="active" checked>
                        <label class="form-check-label" for="active">Account Active</label>
                    </div>

                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="button" class="btn btn-secondary me-md-2" onclick="loadUserManagement()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Register User</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('content-container').innerHTML = html;

    // Add form submission handler
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        registerNewUser();
    });

    // Add password toggle
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordField = document.getElementById('password');
        const icon = this.querySelector('i');
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordField.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
}

// Register new user
function registerNewUser() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value;
    const department = document.getElementById('department').value;
    const studentId = document.getElementById('studentId')?.value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const active = document.getElementById('active').checked;

    // Validate form
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters!');
        return;
    }

    if (role === 'student' && !studentId) {
        alert('Student ID is required!');
        return;
    }

    if ((role === 'faculty' || role === 'student') && !department) {
        alert('Department is required!');
        return;
    }

    // Check if email already exists
    if (users.some(user => user.email === email)) {
        alert('Email address already in use!');
        return;
    }

    // Create new user object
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
        name: `${firstName} ${lastName}`,
        email,
        role,
        department: role === 'admin' ? 'Administration' : department,
        active,
        createdAt: new Date().toISOString().split('T')[0],
        studentId: role === 'student' ? studentId : undefined
    };

    // Add to users array (in real app, this would be an API call)
    users.push(newUser);

    // Show success message
    alert(`User ${newUser.name} registered successfully!`);

    // Return to user management
    loadUserManagement();
}

// Helper functions
function getRoleBadgeClass(role) {
    switch(role) {
        case 'admin': return 'bg-danger';
        case 'faculty': return 'bg-primary';
        case 'student': return 'bg-success';
        default: return 'bg-secondary';
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize with sample data if empty
if (users.length === 0) {
    users = [
        {
            id: 1,
            name: "Admin User",
            email: "admin@university.edu",
            role: "admin",
            department: "Administration",
            active: true,
            createdAt: "2023-01-15"
        }
    ];
}

// Load user management by default when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadUserManagement();
});