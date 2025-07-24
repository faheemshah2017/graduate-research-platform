// Student-specific functions

// Load document submission page
function loadDocumentSubmission() {
    const submissionHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Document Submission</h1>
        </div>
        
        <div class="row">
            <div class="col-md-20">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5>Submit New Document</h5>
                    </div>
                    <div class="card-body">
                        <form id="documentForm">
                            <div class="mb-3">
                                <label for="documentType" class="form-label">Document Type</label>
                                <select class="form-select" id="documentType" required>
                                    <option value="">Select Type</option>
                                    <option value="proposal">Research Proposal</option>
                                    <option value="progress">Progress Report</option>
                                    <option value="thesis">Final Thesis</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="documentTitle" class="form-label">Title</label>
                                <input type="text" class="form-control" id="documentTitle" required>
                            </div>
                            <div class="mb-3">
                                <label for="documentAbstract" class="form-label">Abstract</label>
                                <textarea class="form-control" id="documentAbstract" rows="3" required></textarea>
                            </div>
                            <div class="mb-3">
                               <label for="documentSupervisor" class="form-label">Select Supervisor</label>
                               <select class="form-select" id="documentSupervisor" required>
                               <option value="">Select a supervisor</option>
                               </select>
                            </div>  
                            <div class="mb-3">
                                <label for="documentFile" class="form-label">Document File</label>
                                <div class="upload-area" id="uploadArea">
                                    <i class="fas fa-cloud-upload-alt fa-3x mb-3"></i>
                                    <p>Drag & drop your file here or click to browse</p>
                                    <input type="file" id="documentFile" style="display: none;">
                                    <button type="button" class="btn btn-outline-primary mt-2" onclick="document.getElementById('documentFile').click()">
                                        Select File
                                    </button>
                                </div>
                                <small class="text-muted">Accepted formats: PDF, DOCX (Max size: 10MB)</small>
                                <div id="fileInfo" class="mt-2" style="display: none;">
                                    <span id="fileName"></span>
                                    <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="clearFileSelection()">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit Document</button>
                        </form>
                    </div>
                </div>
            </div>
    `;
    
    document.getElementById('content-container').innerHTML = submissionHtml;

    // Dynamically populate supervisor dropdown with faculty members
    fetch('/api/users?role=faculty')
        .then(res => res.json())
        .then(facultyList => {
            const supervisorSelect = document.getElementById('documentSupervisor');
            supervisorSelect.innerHTML = '<option value="">Select a supervisor</option>';
            facultyList.forEach(faculty => {
                supervisorSelect.innerHTML += `<option value="${faculty._id}">${faculty.name}</option>`;
            });
        })
        .catch(() => {
            // fallback: show error or keep default
        });

    // Setup file upload area
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('documentFile');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            fileName.textContent = fileInput.files[0].name;
            fileInfo.style.display = 'block';
            uploadArea.style.borderColor = 'var(--primary-color)';
            uploadArea.style.backgroundColor = 'rgba(0, 100, 0, 0.05)';
        }
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
        uploadArea.style.backgroundColor = 'rgba(0, 100, 0, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.borderColor = '#ccc';
        uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
        uploadArea.style.backgroundColor = 'rgba(0, 100, 0, 0.05)';
        
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            fileName.textContent = fileInput.files[0].name;
            fileInfo.style.display = 'block';
        }
    });
    
    // Form submit handler
    document.getElementById('documentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('grp_user'));
        if (!user || !user._id) {
            showAlert('User not authenticated', 'danger');
            return;
        }
        if (!fileInput.files.length) {
            showAlert('Please select a file to upload', 'danger');
            return;
        }
        const formData = new FormData();
        formData.append('type', document.getElementById('documentType').value);
        formData.append('title', document.getElementById('documentTitle').value);
        formData.append('abstract', document.getElementById('documentAbstract').value);
        formData.append('advisor', document.getElementById('documentSupervisor').value); // Save supervisor as advisor
        formData.append('student', user._id); // Attach studentId
        formData.append('file', fileInput.files[0]);
        const response = await fetch('/api/documents', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            showAlert('Document submitted successfully!', 'success');
            this.reset();
            fileInfo.style.display = 'none';
            uploadArea.style.borderColor = '#ccc';
            uploadArea.style.backgroundColor = '';
        } else {
            showAlert('Failed to submit document', 'danger');
        }
    });
}

// Clear file selection
function clearFileSelection() {
    document.getElementById('documentFile').value = '';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('uploadArea').style.borderColor = '#ccc';
    document.getElementById('uploadArea').style.backgroundColor = '';
}

// Load progress tracking
async function loadProgressTracking() {
    const user = JSON.parse(localStorage.getItem('grp_user'));
    const response = await fetch(`/api/documents/review?student=${user._id}`);
    const documents = await response.json();
    // Only show documents with current student id
    const filteredDocs = documents.filter(doc => doc.student?._id === user._id || doc.student === user._id);
    let rows = filteredDocs.map(doc => `
        <tr>
            <td>${doc.title}</td>
            <td>${doc.type}</td>
            <td>${new Date(doc.submissionDate).toLocaleDateString()}</td>
            <td><span class="badge ${doc.status === 'Approved' ? 'bg-success' : doc.status === 'Pending Review' ? 'bg-warning text-dark' : 'bg-secondary'}">${doc.status}</span></td>
            <td style="cursor: pointer; color: #0d6efd;" onclick="loadFeedback('${doc._id}')">View</td>
        </tr>
    `).join('');
    const progressHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Progress Tracking</h1>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>My Submissions</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                                <th>Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-container').innerHTML = progressHtml;
    
}

// Load feedback
async function loadFeedback(docId) {
    let doc;
    const user = JSON.parse(localStorage.getItem('grp_user'));
    if (docId) {
        // Fetch specific document by ID
        const response = await fetch(`/api/documents/${docId}`);
        doc = await response.json();
        // Filter feedback for current student only
        if (doc.feedback && Array.isArray(doc.feedback)) {
            doc.feedback = doc.feedback.filter(fb => doc.student?._id === user._id || doc.student === user._id);
        }
    } else {
        // Fetch all documents for the current student
        const response = await fetch(`/api/documents/review?student=${user._id}`);
        const documents = await response.json();
        // Flatten all feedbacks from all documents, only for current student
        doc = { feedback: [] };
        documents.forEach(d => {
            if ((d.student?._id === user._id || d.student === user._id) && d.feedback && d.feedback.length > 0) {
                d.feedback.forEach(fb => {
                    doc.feedback.push({ ...fb, title: d.title, advisor: d.advisor });
                });
            }
        });
    }
    let feedbackHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Feedback</h1>
        </div>
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-6">
                        <h5>Received Feedback</h5>
                   </div>
              <div class="card-body">
                <div class="list-group">
    `;
    if (doc.feedback && doc.feedback.length > 0) {
        doc.feedback.forEach(fb => {
            feedbackHtml += `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h6>${fb.title || doc.title} Feedback</h6>
                        <small>${new Date(fb.date).toLocaleDateString()}</small>
                    </div>
                    <div class="feedback-comment mt-2">
                        <p>${fb.comments}</p>
                        <small class="text-muted">From: ${doc.advisor?.name || fb.advisor?.name|| ''}</small>
                    </div>
                    <div class="mt-2">
                        <button class="btn btn-primary" onclick="loadChat()">
                            <i class="fas fa-comments"></i> Start Chat
                        </button>
                    </div>
                </div>
            `;
        });
    } else {
        feedbackHtml += '<div class="list-group-item">No feedback yet..</div>';
    }
    feedbackHtml += '</div></div></div>';
    document.getElementById('content-container').innerHTML = feedbackHtml;
}

// Load grades
async function loadGrades() {
    const user = JSON.parse(localStorage.getItem('grp_user'));
    let rows = '';
    if (user && user.role === 'student') {
        // Student: show only their own documents/grades
        const response = await fetch('/api/documents/review');
        const documents = await response.json();
        documents.filter(doc => doc.student?._id === user._id).forEach(doc => {
            (doc.feedback || []).forEach(fb => {
                rows += `
                    <tr>
                        <td>${doc.title}</td>
                        <td>${doc.type}</td>
                        <td>${doc.submissionDate ? new Date(doc.submissionDate).toLocaleDateString() : ''}</td>
                        <td><span class="badge bg-success">${fb.grade || ''}</span></td>
                        <td>${doc.advisor?.name || ''}</td>
                    </tr>
                `;
            });
        });
    } else {
        // Faculty: show all grades for all students
        const response = await fetch('/api/documents/review');
        const documents = await response.json();
        documents.forEach(doc => {
            (doc.feedback || []).forEach(fb => {
                rows += `
                    <tr>
                        <td>${doc.title}</td>
                        <td>${doc.type}</td>
                        <td>${doc.submissionDate ? new Date(doc.submissionDate).toLocaleDateString() : ''}</td>
                        <td><span class="badge bg-success">${fb.grade || ''}</span></td>
                        <td>${doc.advisor?.name || ''}</td>
                    </tr>
                `;
            });
        });
    }
    const gradesHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Grades</h1>
        </div>
        <div class="card">
            <div class="card-header">
                <h5>My Grades</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Document</th>
                                <th>Type</th>
                                <th>Submission Date</th>
                                <th>Grade</th>
                                <th>Supervisor</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-container').innerHTML = gradesHtml;
}

// Load chat
function loadChat() {
    const chatHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Chat</h1>
        </div>
        
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <ul class="nav nav-tabs card-header-tabs">
                            <li class="nav-item">
                                <button class="nav-link active" id="faculty-tab">Faculty</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="students-tab">Students</button>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body p-0">
                        <div class="list-group list-group-flush" id="facultyContacts">
                            <!-- Faculty contacts will be loaded here -->
                        </div>
                        <div class="list-group list-group-flush d-none" id="studentsContacts">
                            <!-- Student contacts will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0" id="chatTitle">Select a contact to chat</h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="chat-container" id="chatContainer" style="height: 400px; overflow-y: auto;">
                            <div class="text-center text-muted py-5">
                                Select a contact from the list to start chatting
                            </div>
                        </div>
                        <div class="p-3 border-top">
                            <form id="chatForm">
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="Type your message..." id="chatMessage" disabled>
                                    <button class="btn btn-primary" type="submit" disabled>
                                        <i class="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-container').innerHTML = chatHtml;
    
    // Load contacts
    loadContacts();
    
    // Tab switching
    document.getElementById('faculty-tab').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('students-tab').classList.remove('active');
        document.getElementById('facultyContacts').classList.remove('d-none');
        document.getElementById('studentsContacts').classList.add('d-none');
    });
    
    document.getElementById('students-tab').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('faculty-tab').classList.remove('active');
        document.getElementById('studentsContacts').classList.remove('d-none');
        document.getElementById('facultyContacts').classList.add('d-none');
    });
    
    // Form submit handler
    document.getElementById('chatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
    });
}

function loadContacts() {
    // Sample data - in real app this would come from API
    const facultyContacts = [
        { id: 1, name: "Dr. Smith" },
        { id: 2, name: "Dr. Johnson" },
        { id: 3, name: "Prof. Williams" }
    ];

    const studentContacts = [
        { id: 101, name: "John Doe" },
        { id: 102, name: "Jane Smith" },
        { id: 103, name: "Alex Johnson" }
    ];

    const facultyList = document.getElementById('facultyContacts');
    const studentsList = document.getElementById('studentsContacts');
    
    // Add faculty contacts
    facultyContacts.forEach(contact => {
        const contactItem = document.createElement('button');
        contactItem.className = 'list-group-item list-group-item-action text-start';
        contactItem.innerHTML = `
            <h6 class="mb-1">${contact.name}</h6>
        `;
        contactItem.addEventListener('click', function() {
            startChat(contact.id, contact.name);
        });
        facultyList.appendChild(contactItem);
    });

    // Add student contacts
    studentContacts.forEach(contact => {
        const contactItem = document.createElement('button');
        contactItem.className = 'list-group-item list-group-item-action text-start';
        contactItem.innerHTML = `
            <h6 class="mb-1">${contact.name}</h6>
        `;
        contactItem.addEventListener('click', function() {
            startChat(contact.id, contact.name);
        });
        studentsList.appendChild(contactItem);
    });
}

function startChat(contactId, contactName) {
    document.getElementById('chatTitle').textContent = `Chat with ${contactName}`;
    
    // Enable message input and send button
    const messageInput = document.getElementById('chatMessage');
    const sendButton = document.querySelector('#chatForm button[type="submit"]');
    messageInput.disabled = false;
    sendButton.disabled = false;
    messageInput.focus();
    
    // Load chat history (empty for new chats)
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = `
        <div class="chat-message received">
            <p>Hello! How can I help you today?</p>
            <small class="text-muted">${contactName} - Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
        </div>
    `;
    
    // Highlight selected contact
    document.querySelectorAll('.list-group-item-action').forEach(item => {
        item.classList.remove('active');
        if (item.textContent.trim() === contactName) {
            item.classList.add('active');
        }
    });
}

function sendMessage() {
    const messageInput = document.getElementById('chatMessage');
    const message = messageInput.value.trim();
    
    if (message) {
        const chatContainer = document.getElementById('chatContainer');
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Add sent message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message sent';
        messageDiv.innerHTML = `
            <p>${message}</p>
            <small class="text-muted">You - Today, ${timeString}</small>
        `;
        chatContainer.appendChild(messageDiv);
        
        // Clear input
        messageInput.value = '';
        messageInput.focus();
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Simulate reply after 1 second
        setTimeout(() => {
            const contactName = document.getElementById('chatTitle').textContent.replace('Chat with ', '');
            const replyDiv = document.createElement('div');
            replyDiv.className = 'chat-message received';
            replyDiv.innerHTML = `
                <p>Thanks for your message!</p>
                <small class="text-muted">${contactName} - Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
            `;
            chatContainer.appendChild(replyDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 1000);
    }
}

// Load meetings
function loadMeetings() {
    const meetingsHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Online Meetings</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <button class="btn btn-sm btn-primary" onclick="startInstantMeeting()">
                    <i class="fas fa-video me-1"></i> Start Instant Meeting
                </button>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <ul class="nav nav-tabs card-header-tabs">
                            <li class="nav-item">
                                <button class="nav-link active" id="faculty-tab">Faculty</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="students-tab">Students</button>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body p-0">
                        <div class="list-group list-group-flush" id="facultyContacts">
                            <!-- Faculty contacts will be loaded here -->
                        </div>
                        <div class="list-group list-group-flush d-none" id="studentsContacts">
                            <!-- Student contacts will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0" id="meetingTitle">Select participants to start meeting</h5>
                    </div>
                    <div class="card-body">
                        <div id="selectedParticipants" class="mb-3"></div>
                        <button class="btn btn-primary w-100" id="startMeetingBtn" disabled onclick="startGoogleMeet()">
                            <i class="fas fa-video me-1"></i> Start Google Meet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-container').innerHTML = meetingsHtml;
    
    // Load contacts
    loadMeetingContacts();
    
    // Tab switching
    document.getElementById('faculty-tab').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('students-tab').classList.remove('active');
        document.getElementById('facultyContacts').classList.remove('d-none');
        document.getElementById('studentsContacts').classList.add('d-none');
    });
    
    document.getElementById('students-tab').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('faculty-tab').classList.remove('active');
        document.getElementById('studentsContacts').classList.remove('d-none');
        document.getElementById('facultyContacts').classList.add('d-none');
    });
    
    // Poll for meeting notifications
    startMeetingPolling();
}

async function loadMeetingContacts() {
    // Fetch users from backend
    let users = [];
    try {
        const res = await fetch('/api/users');
        users = await res.json();
    } catch {
        showAlert('Failed to load contacts from server', 'danger');
        users = [];
    }
    const facultyContacts = users.filter(u => u.role === 'faculty');
    const studentContacts = users.filter(u => u.role === 'student');
    const facultyList = document.getElementById('facultyContacts');
    const studentsList = document.getElementById('studentsContacts');
    facultyList.innerHTML = '';
    studentsList.innerHTML = '';
    facultyContacts.forEach(contact => {
        const contactItem = document.createElement('button');
        contactItem.className = 'list-group-item list-group-item-action text-start';
        contactItem.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="contact-${contact._id}" data-id="${contact._id}" data-name="${contact.name}" data-email="${contact.email}">
                <label class="form-check-label" for="contact-${contact._id}">
                    ${contact.name}
                </label>
            </div>
        `;
        contactItem.addEventListener('change', updateSelectedParticipants);
        facultyList.appendChild(contactItem);
    });
    studentContacts.forEach(contact => {
        const contactItem = document.createElement('button');
        contactItem.className = 'list-group-item list-group-item-action text-start';
        contactItem.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="contact-${contact._id}" data-id="${contact._id}" data-name="${contact.name}" data-email="${contact.email}">
                <label class="form-check-label" for="contact-${contact._id}">
                    ${contact.name}
                </label>
            </div>
        `;
        contactItem.addEventListener('change', updateSelectedParticipants);
        studentsList.appendChild(contactItem);
    });
}

function updateSelectedParticipants() {
    const selectedContainer = document.getElementById('selectedParticipants');
    const startButton = document.getElementById('startMeetingBtn');
    const checkboxes = document.querySelectorAll('.form-check-input:checked');
    
    selectedContainer.innerHTML = '';
    
    if (checkboxes.length > 0) {
        const participantList = document.createElement('div');
        participantList.className = 'alert alert-info';
        participantList.innerHTML = `
            <h6>Selected Participants (${checkboxes.length})</h6>
            <ul class="mb-0">
                ${Array.from(checkboxes).map(checkbox => 
                    `<li>${checkbox.dataset.name}</li>`
                ).join('')}
            </ul>
        `;
        selectedContainer.appendChild(participantList);
        startButton.disabled = false;
    } else {
        selectedContainer.innerHTML = '<div class="alert alert-light">No participants selected</div>';
        startButton.disabled = true;
    }
}

function startGoogleMeet() {
    const checkboxes = document.querySelectorAll('.form-check-input:checked');
    const emails = Array.from(checkboxes).map(checkbox => checkbox.dataset.email);
    const userIds = Array.from(checkboxes).map(checkbox => checkbox.dataset.id);
    // Step 1: Open new meeting
    window.open('https://meet.google.com/new', '_blank');
    // Step 2: Prompt for actual meeting link (wait for user to switch tab)
    setTimeout(() => {
        let meetLink = '';
        // Use a modal for better UX
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.zIndex = '99999';
        modal.innerHTML = `
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:30px;border-radius:8px;max-width:400px;width:90%;box-shadow:0 2px 16px rgba(0,0,0,0.2);">
                <h5>Paste Google Meet Link</h5>
                <input type="text" id="meetLinkInput" class="form-control mb-3" placeholder="https://meet.google.com/abc-defg-hij">
                <button id="sendMeetLinkBtn" class="btn btn-primary">Send Link to Participants</button>
                <button id="cancelMeetLinkBtn" class="btn btn-outline-secondary ms-2">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('meetLinkInput').focus();
        document.getElementById('sendMeetLinkBtn').onclick = function() {
            meetLink = document.getElementById('meetLinkInput').value.trim();
            if (meetLink && meetLink.startsWith('https://meet.google.com/')) {
                fetch('/api/meetings/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userIds, meetLink })
                });
                showAlert('Meeting link sent to selected participants!', 'success');
                document.body.removeChild(modal);
            } else {
                alert('Please enter a valid Google Meet link.');
            }
        };
        document.getElementById('cancelMeetLinkBtn').onclick = function() {
            document.body.removeChild(modal);
        };
    }, 1200);
}

// Mark meeting as attended
async function markMeetingAttended(meetingId, btn) {
    await fetch(`/api/meetings/for-user/${meetingId}/attend`, { method: 'POST' });
    const notifyDiv = btn.closest('.alert');
    if (notifyDiv) notifyDiv.remove();
}

// Show meeting notification
function showMeetingNotification(meeting) {
    if (!document.getElementById(`meeting-notify-${meeting._id}`)) {
        let container = document.getElementById('meeting-notify-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'meeting-notify-container';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '9999';
            container.style.maxWidth = '350px';
            document.body.appendChild(container);
        }
        const notifyDiv = document.createElement('div');
        notifyDiv.className = 'alert alert-warning shadow';
        notifyDiv.id = `meeting-notify-${meeting._id}`;
        notifyDiv.style.marginBottom = '10px';
        notifyDiv.innerHTML = `
            <strong>New Meeting!</strong> <br>
            <a href="${meeting.meetLink}" target="_blank" class="btn btn-sm btn-success join-meeting-btn" data-id="${meeting._id}">Join Meeting</a>
            <button class="btn btn-sm btn-outline-secondary ms-2 dismiss-meeting-btn" data-id="${meeting._id}">Dismiss</button>
        `;
        container.appendChild(notifyDiv);
    }
}

function startMeetingPolling() {
    const user = JSON.parse(localStorage.getItem('grp_user'));
    if (!user || !user._id) { return; }
    setInterval(async () => {
        try {
            const response = await fetch(`/api/meetings/for-user/${user._id}`);
            const meetings = await response.json();
            if (meetings && meetings.length > 0) {
                meetings.forEach(meeting => {
                    showMeetingNotification(meeting);
                });
                // Attach event listeners for join/dismiss
                document.querySelectorAll('.join-meeting-btn').forEach(function(btn) {
                    btn.onclick = async function(e) {
                        const meetingId = this.getAttribute('data-id');
                        await markMeetingAttended(meetingId);
                        window.open(this.href, '_blank');
                        const notifyDiv = document.getElementById(`meeting-notify-${meetingId}`);
                        if (notifyDiv) { notifyDiv.remove(); }
                        e.preventDefault();
                    };
                });
                document.querySelectorAll('.dismiss-meeting-btn').forEach(function(btn) {
                    btn.onclick = async function() {
                        const meetingId = this.getAttribute('data-id');
                        await markMeetingAttended(meetingId);
                        const notifyDiv = document.getElementById(`meeting-notify-${meetingId}`);
                        if (notifyDiv) { notifyDiv.remove(); }
                    };
                });
            }
        } catch (err) {
            // Ignore polling errors
        }
    }, 10000);
}

async function markMeetingAttended(meetingId) {
    await fetch(`/api/meetings/attend/${meetingId}`, { method: 'POST' });
}