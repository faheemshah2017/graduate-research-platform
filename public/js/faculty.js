// Faculty-specific functions

// Load document review
async function loadDocumentReview() {
    const response = await fetch('/api/documents/review');
    const documents = await response.json();
    const user = JSON.parse(localStorage.getItem('grp_user'));
    // Only show documents where advisor is the current faculty
    const filteredDocs = documents.filter(doc => doc.advisor?._id === user._id);
    let rows = filteredDocs.map(doc => `
        <tr>
            <td>${doc.title}</td>
            <td>${doc.student?.name || ''}</td>
            <td>${doc.type}</td>
            <td>${new Date(doc.submissionDate).toLocaleDateString()}</td>
            <td><span class="badge ${doc.status === 'Pending Review' ? 'bg-warning text-dark' : doc.status === 'In Progress' ? 'bg-info' : doc.status === 'Approved' ? 'bg-success' : 'bg-danger'}">${doc.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="reviewDocument('${doc._id}')">
                    <i class="fas fa-file-alt"></i> Review
                </button>
            </td>
        </tr>
    `).join('');
    const reviewHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Document Review</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <div class="btn-group me-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-6">
                        <h5>Documents to Review</h5>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Student</th>
                                <th>Type</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                                <th>Actions</th>
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
    
    document.getElementById('content-container').innerHTML = reviewHtml;
}

// Review document
async function reviewDocument(docId) {
    const response = await fetch(`/api/documents/${docId}`);
    const doc = await response.json();
    const reviewHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Review Document</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="loadDocumentReview()">
                    <i class="fas fa-arrow-left"></i> Back to List
                </button>
            </div>
        </div>
        
        <div class="card mb-4">
            <div class="card-header">
                <h5>Document Details</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Title:</strong> ${doc.title}</p>
                        <p><strong>Student:</strong> ${doc.student?.name || ''}</p>
                        <p><strong>Type:</strong> ${doc.type}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Submission Date:</strong> ${new Date(doc.submissionDate).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> <span class="badge bg-warning text-dark">${doc.status}</span></p>
                        <p><strong>Advisor:</strong> ${doc.advisor?.name || ''}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <button class="btn btn-primary me-2" onclick="window.open('/api/documents/${doc._id}/download', '_blank')">
                        <i class="fas fa-download"></i> Download Document
                    </button>
                    <button class="btn btn-outline-secondary" onclick="window.open('/api/documents/${doc._id}/view', '_blank')">
                        <i class="fas fa-eye"></i> View Online
                    </button>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>Review & Feedback</h5>
            </div>
            <div class="card-body">
                <form id="reviewForm">
                    <div class="mb-3">
                        <label for="overallComments" class="form-label">Overall Comments</label>
                        <textarea class="form-control" id="overallComments" rows="3" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Grading</label>
                                <select class="form-select" id="Grade" required>
                                    <option value="">Select Grade</option>
                                    <option value="A">A (90-100%)</option>
                                    <option value="B">B (80-89%)</option>
                                    <option value="C">C (70-79%)</option>
                                    <option value="D">D (60-69%)</option>
                                    <option value="F">F (Below 60%)</option>
                                </select>
                    <div class="mb-3">
                        <label for="recommendation" class="form-label">Recommendation</label>
                        <select class="form-select" id="recommendation" required>
                            <option value="">Select Recommendation</option>
                            <option value="approve">Approve</option>
                            <option value="approve_with_minor">Approve with Minor Revisions</option>
                            <option value="revise">Revise and Resubmit</option>
                            <option value="reject">Reject</option>
                        </select>
                    </div>
                    
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="submit" class="btn btn-primary me-md-2">
                            <i class="fas fa-check"></i> Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('content-container').innerHTML = reviewHtml;
    
    // Setup form handlers
    document.getElementById('reviewForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const comments = document.getElementById('overallComments').value;
        const grade = document.getElementById('Grade').value;
        const recommendation = document.getElementById('recommendation').value;
        const user = JSON.parse(localStorage.getItem('grp_user'));
        await fetch(`/api/documents/${docId}/review`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-user-id': user._id },
            body: JSON.stringify({ comments, grade, recommendation, faculty: user._id })
        });
        showAlert('Review submitted successfully!', 'success');
        loadDocumentReview();
    });

}

// Load grading
async function loadGrading() {
    const response = await fetch('/api/documents/review');
    const documents = await response.json();
    let rows = '';
    documents.forEach(doc => {
        (doc.feedback || []).forEach(fb => {
            rows += `
                <tr>
                    <td>${doc.student?.name || ''}</td>
                    <td>${doc.title}</td>
                    <td>${doc.type}</td>
                    <td>${doc.submissionDate ? new Date(doc.submissionDate).toLocaleDateString() : ''}</td>
                    <td><span class="badge bg-success">${fb.grade || ''}</span></td>
                    <td>${doc.advisor?.name || ''}</td>
                </tr>
            `;
        });
    });
    const gradingHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Grading</h1>
        </div>
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-6">
                        <h5>Grades (from Document Reviews)</h5>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Document</th>
                                <th>Type</th>
                                <th>Submission Date</th>
                                <th>Grade</th>
                                <th>Reviewer</th>
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
    document.getElementById('content-container').innerHTML = gradingHtml;
}

// Load search
async function loadSearch() {
    const searchHtml = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Search</h1>
        </div>
        
        <div class="card mb-4">
            <div class="card-body">
                <form id="searchForm">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="searchQuery" class="form-label">Search Term</label>
                            <input type="text" class="form-control" id="searchQuery" placeholder="Enter keywords...">
                        </div>
                        <div class="col-md-3">
                            <label for="searchType" class="form-label">Search Type</label>
                            <select class="form-select" id="searchType">
                                <option value="all">All</option>
                                <option value="students">Students</option>
                                <option value="documents">Documents</option>
                                <option value="feedback">Feedback</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="searchDepartment" class="form-label">Department</label>
                            <select class="form-select" id="searchDepartment">
                                <option value="all">All Departments</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Software Engineering">Software Engineering</option>
                                <option value="ds">Data Science</option>
                                <option value="Mathematics">Mathematics</option>
                            </select>
                        </div>
                    </div>
                    <div class="mt-3">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-search"></i> Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h5>Search Results</h5>
            </div>
            <div class="card-body">
                <div class="alert alert-info">
                    Enter search criteria and click "Search" to see results.
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-container').innerHTML = searchHtml;
    
    // Form submit handler
    document.getElementById('searchForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const query = document.getElementById('searchQuery').value;
        const type = document.getElementById('searchType').value;
        const department = document.getElementById('searchDepartment').value;
        let apiUrl = `/api/search?q=${encodeURIComponent(query)}`;
        if (type && type !== 'all') apiUrl += `&type=${type}`;
        if (department && department !== 'all') apiUrl += `&department=${department}`;
        if (query) {
            const response = await fetch(apiUrl);
            const results = await response.json();
            let resultsHtml = '<div class="list-group">';
            if (results.documents && results.documents.length) {
                results.documents.forEach(d => {
                    resultsHtml += `<div class="list-group-item">
                        <div class="d-flex w-100 justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1">${d.title}</h6>
                                <small>Type: ${d.type} | Status: ${d.status}${d.department ? ' | Department: ' + d.department : ''}${d.student ? ' | Student: ' + (d.student.name || d.student) : ''}</small>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-outline-primary me-2" onclick="window.open('/api/documents/${d._id}/download', '_blank')"><i class='fas fa-download'></i> Download</button>
                                <button class="btn btn-sm btn-outline-info" onclick="window.open('/api/documents/${d._id}/view', '_blank')"><i class='fas fa-eye'></i> View</button>
                            </div>
                        </div>
                    </div>`;
                });
            }
            if (results.students && results.students.length) {
                results.students.forEach(s => {
                    resultsHtml += `<div class='list-group-item'>
                        <div class='d-flex w-100 justify-content-between'>
                            <h6 class='mb-1'>${s.name}</h6>
                            <small>Student</small>
                        </div>
                        <p class='mb-1'>${s.email}</p>
                    </div>`;
                });
            }
            if (results.feedback && results.feedback.length) {
                results.feedback.forEach(f => {
                    resultsHtml += `<div class='list-group-item'>
                        <div class='d-flex w-100 justify-content-between'>
                            <h6 class='mb-1'>${f.title}</h6>
                            <small>Feedback</small>
                        </div>
                        <p class='mb-1'>${f.feedback.comments}</p>
                        <small>Grade: ${f.feedback.grade}</small>
                    </div>`;
                });
            }
            if (resultsHtml === '<div class="list-group">') {
                resultsHtml += '<div class="list-group-item">No results found.</div>';
            }
            resultsHtml += '</div>';
            // Show results in the search results card, not in the form card
            document.querySelector('.card + .card .card-body').innerHTML = resultsHtml;
        }
    });
}

// Meeting notifications
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