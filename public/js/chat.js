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

let currentChatUserId = null;
let chatPollingInterval = null;

function loadContacts() {
    // Fetch users from backend
    const user = JSON.parse(localStorage.getItem('grp_user'));
    fetch('/api/users')
        .then(res => res.json())
        .then(users => {
            // Remove current user from contacts
            const filteredUsers = users.filter(u => u._id !== user._id);
            const facultyContacts = filteredUsers.filter(u => u.role === 'faculty');
            const studentContacts = filteredUsers.filter(u => u.role === 'student');
            const facultyList = document.getElementById('facultyContacts');
            const studentsList = document.getElementById('studentsContacts');
            facultyList.innerHTML = '';
            studentsList.innerHTML = '';
            facultyContacts.forEach(contact => {
                const contactItem = document.createElement('button');
                contactItem.className = 'list-group-item list-group-item-action text-start';
                contactItem.innerHTML = `<h6 class="mb-1">${contact.name}</h6>`;
                contactItem.addEventListener('click', function() {
                    startChat(contact._id, contact.name);
                });
                facultyList.appendChild(contactItem);
            });
            studentContacts.forEach(contact => {
                const contactItem = document.createElement('button');
                contactItem.className = 'list-group-item list-group-item-action text-start';
                contactItem.innerHTML = `<h6 class="mb-1">${contact.name}</h6>`;
                contactItem.addEventListener('click', function() {
                    startChat(contact._id, contact.name);
                });
                studentsList.appendChild(contactItem);
            });
        })
        .catch(() => {
            showAlert('Failed to load contacts from server', 'danger');
        });
}

function startChat(contactId, contactName) {
    currentChatUserId = contactId;
    document.getElementById('chatTitle').textContent = `Chat with ${contactName}`;
    const messageInput = document.getElementById('chatMessage');
    const sendButton = document.querySelector('#chatForm button[type="submit"]');
    messageInput.disabled = false;
    sendButton.disabled = false;
    messageInput.focus();
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '<div class="text-center text-muted py-3">Loading chat...</div>';
    // Stop previous polling if any
    if (chatPollingInterval) clearInterval(chatPollingInterval);
    // Function to fetch and render chat history
    function fetchChatHistory() {
        const user = JSON.parse(localStorage.getItem('grp_user'));
        fetch(`/api/chat?user2=${contactId}`, {
            headers: { 'x-user-id': user._id }
        })
            .then(res => res.json())
            .then(messages => {
                chatContainer.innerHTML = '';
                messages.forEach(msg => {
                    const isSent = msg.sender === user._id;
                    const msgDiv = document.createElement('div');
                    msgDiv.className = 'chat-message ' + (isSent ? 'sent' : 'received');
                    msgDiv.innerHTML = `
                        <p>${msg.message}</p>
                        <small class="text-muted">${isSent ? 'You' : contactName} - ${new Date(msg.timestamp).toLocaleString()}</small>
                    `;
                    chatContainer.appendChild(msgDiv);
                });
                chatContainer.scrollTop = chatContainer.scrollHeight;
            })
            .catch(() => {
                chatContainer.innerHTML = '<div class="text-danger text-center py-3">Failed to load chat history</div>';
            });
    }
    fetchChatHistory();
    chatPollingInterval = setInterval(fetchChatHistory, 3000); // Poll every 3 seconds
    // Highlight selected contact
    document.querySelectorAll('.list-group-item-action').forEach(item => {
        item.classList.remove('active');
        if (item.textContent.trim() === contactName) {
            item.classList.add('active');
        }
    });
}

// Optionally, clear polling when leaving chat page
window.addEventListener('hashchange', () => {
    if (chatPollingInterval) clearInterval(chatPollingInterval);
});

function sendMessage() {
    const messageInput = document.getElementById('chatMessage');
    const message = messageInput.value.trim();
    const user = JSON.parse(localStorage.getItem('grp_user'));
    if (message && currentChatUserId && user && user._id) {
        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: user._id, recipient: currentChatUserId, message })
        })
        .then(res => res.json())
        .then(data => {
            if (data.chat) {
                const chatContainer = document.getElementById('chatContainer');
                const msgDiv = document.createElement('div');
                msgDiv.className = 'chat-message sent';
                msgDiv.innerHTML = `
                    <p>${data.chat.message}</p>
                    <small class="text-muted">You - ${new Date(data.chat.timestamp).toLocaleString()}</small>
                `;
                chatContainer.appendChild(msgDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        });
        messageInput.value = '';
        messageInput.focus();
    }
}