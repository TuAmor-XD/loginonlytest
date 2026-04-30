// Authentication Check - Redirect to login if not authenticated
(function() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = '../../login.html';
        return;
    }
    
    const user = JSON.parse(currentUser);
    
    // Verify user is a teacher
    if (user.accountType !== 'teacher') {
        alert('Access denied. Teacher privileges required.');
        window.location.href = '../../login.html';
        return;
    }
    
    // Update teacher name display
    const teacherNameElement = document.getElementById('teacherName');
    if (teacherNameElement) {
        teacherNameElement.textContent = `${user.firstName || ''} ${user.lastName || ''}`;
    }
})();

// Student button navigation
const stu = document.getElementById('stu');
if (stu) {
    stu.addEventListener('click', ()=>{
        window.open('../../Students/students.html', '_self')
    })
}

// Logout function
function logout() {
    DB.logout();
    window.location.href = '../../login.html';
}