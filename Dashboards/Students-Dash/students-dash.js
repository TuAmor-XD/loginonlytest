// Authentication Check - Redirect to login if not authenticated
(function() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = '../../login.html';
        return;
    }
    
    const user = JSON.parse(currentUser);
    
    // Verify user is a student
    if (user.accountType !== 'student') {
        alert('Access denied. Student privileges required.');
        window.location.href = '../../login.html';
        return;
    }
    
    // Update welcome message with user's name
    const welcomeElement = document.getElementById('welcomeUser');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome, ${user.firstName} ${user.lastName}`;
    }
})();

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

// Navigation
const courses = document.getElementById('courses');
if (courses) {
    courses.addEventListener('click', ()=>{
      window.open("../../Courses/courses.html", "_self")
    })
}

const home = document.getElementById('BMHS');
if (home) {
    home.addEventListener('click', ()=>{
      window.open("../../index.html", "_self")
    })
}

// Logout function
function logout() {
    DB.logout();
    window.location.href = '../../login.html';
}