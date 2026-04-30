// Theme Toggle
const toggle = document.getElementById("themeToggle");

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
    if(toggle) toggle.textContent = "☀️";
}

if(toggle){
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){
            localStorage.setItem("theme","dark");
            toggle.textContent = "☀️";
        } else {
            localStorage.setItem("theme","light");
            toggle.textContent = "🌙";
        }
    });
}

// Check authentication on page load
(function() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = '../../login.html';
        return;
    }
    
    const user = JSON.parse(currentUser);
    if (user.accountType !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = '../../login.html';
        return;
    }
    
    // Display user info
    document.getElementById('userInfo').textContent = `Welcome, ${user.firstName} ${user.lastName}`;
    
    // Load dashboard data
    loadDashboard();
})();

// Load dashboard statistics and data
function loadDashboard() {
    const db = DB.getDatabase();
    const users = db.users || [];
    
    // Count users by type
    const students = users.filter(u => u.accountType === 'student').length;
    const teachers = users.filter(u => u.accountType === 'teacher').length;
    const admins = users.filter(u => u.accountType === 'admin').length;
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalStudents').textContent = students;
    document.getElementById('totalTeachers').textContent = teachers;
    document.getElementById('totalAdmins').textContent = admins;
    
    // Load generated IDs
    loadGeneratedIDs();
    
    // Load users table
    loadUsersTable();
}

// Load generated student IDs
function loadGeneratedIDs() {
    const db = DB.getDatabase();
    const generatedIDs = db.generatedStudentIDs || [];
    const idsListElement = document.getElementById('generatedIDsList');
    
    if (generatedIDs.length === 0) {
        idsListElement.innerHTML = '<p style="color: #666; margin: 10px 0;">No generated IDs available. Click "Generate" to create new student IDs.</p>';
    } else {
        idsListElement.innerHTML = generatedIDs.map(id => `<code>${id}</code>`).join('');
    }
}

// Generate single student ID
function generateSingleID() {
    const result = DB.generateStudentID();
    showMessage(result.message, 'success');
    loadGeneratedIDs();
    loadDashboard();
}

// Generate multiple student IDs
function generateMultipleIDs() {
    const ids = DB.generateMultipleStudentIDs(5);
    showMessage(`Generated ${ids.length} student IDs: ${ids.join(', ')}`, 'success');
    loadGeneratedIDs();
    loadDashboard();
}

// Clear all generated IDs
function clearGeneratedIDs() {
    const db = DB.getDatabase();
    db.generatedStudentIDs = [];
    DB.saveDatabase(db);
    showMessage('All generated IDs cleared.', 'success');
    loadGeneratedIDs();
}

// Create teacher account
function createTeacher(event) {
    event.preventDefault();
    
    const teacherID = document.getElementById('teacherID').value.trim();
    const password = document.getElementById('teacherPassword').value;
    const name = document.getElementById('teacherName').value.trim();
    const email = document.getElementById('teacherEmail').value.trim();
    const homeroom = document.getElementById('teacherHomeroom').value.trim();
    
    // Validate teacher ID starts with 2
    if (!teacherID.startsWith('2')) {
        showMessage('Teacher ID must start with 2.', 'error');
        return;
    }
    
    const result = DB.createTeacherAccount(teacherID, password, name, email, homeroom);
    showMessage(result.message, result.success ? 'success' : 'error');
    
    if (result.success) {
        event.target.reset();
        loadDashboard();
    }
}

// Load users table
function loadUsersTable() {
    const users = DB.getAllUsers();
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">No users found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.userID}</td>
            <td>${user.firstName} ${user.lastName || ''}</td>
            <td>${user.accountType}</td>
            <td>${user.email}</td>
            <td class="${user.isActive ? 'status-active' : 'status-inactive'}">
                ${user.isActive ? 'Active' : 'Inactive'}
            </td>
            <td>
                <button class="btn ${user.isActive ? 'btn-danger' : 'btn-success'}" 
                        onclick="toggleUserStatus('${user.userID}', ${!user.isActive})"
                        style="padding: 5px 10px; font-size: 12px;">
                    ${user.isActive ? 'Deactivate' : 'Activate'}
                </button>
            </td>
        </tr>
    `).join('');
}

// Toggle user status
function toggleUserStatus(userID, isActive) {
    const result = DB.toggleUserStatus(userID, isActive);
    showMessage(result.message, result.success ? 'success' : 'error');
    if (result.success) {
        loadUsersTable();
    }
}

// Show message
function showMessage(text, type) {
    const messageElement = document.getElementById('adminMessage');
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Logout function
function logout() {
    DB.logout();
    window.location.href = '../../login.html';
}