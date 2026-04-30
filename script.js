// Theme Toggle Functionality
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

// Navigation Functions
const courses = document.getElementById('courses');
if (courses) {
  courses.addEventListener('click', ()=>{
    window.open("./Courses/courses.html", "_self")
  })
}

const home = document.getElementById('BMHS');
if (home) {
  home.addEventListener('click', ()=>{
    window.open("./index.html", "_self")
  })
}

// Login Function - Full Authentication with Database
function login(event) {
  event.preventDefault();

  const userID = document.getElementById("userID").value.trim();
  const password = document.getElementById("password").value;

  // Step 1: Check if user exists in DB
  if (!DB.userExists(userID)) {
    alert('User not found. Please contact admin to create an account.');
    return;
  }

  // Step 2: Check credentials are correct
  const validation = DB.validateCredentials(userID, password);
  if (!validation.success) {
    alert(validation.message);
    return;
  }

  // Step 3: Check account type in DB
  const accountType = DB.getAccountType(userID);
  if (!accountType) {
    alert('Unable to determine account type. Please contact support.');
    return;
  }

  // Step 4: Open appropriate dashboard based on account type
  const dashboardURL = DB.getDashboardURL(accountType);
  if (!dashboardURL) {
    alert('No dashboard configured for this account type.');
    return;
  }

  // Store session and redirect
  sessionStorage.setItem('currentUser', JSON.stringify(validation.user));
  sessionStorage.setItem('loginTime', new Date().toISOString());
  
  // Redirect to the appropriate dashboard
  window.location.href = dashboardURL;
}

// Helper function to check if user is logged in (for dashboard pages)
function requireAuth() {
  const currentUser = sessionStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = './login.html';
    return false;
  }
  return true;
}

// Logout function (for dashboard pages)
function logout() {
  sessionStorage.removeItem('currentUser');
  sessionStorage.removeItem('loginTime');
  window.location.href = './login.html';
}

// Display current user info (for dashboard pages)
function displayUserInfo() {
  const currentUser = sessionStorage.getItem('currentUser');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
      userInfoElement.textContent = `Welcome, ${user.firstName} ${user.lastName} (${user.userID})`;
    }
    
    const accountTypeElement = document.getElementById('accountType');
    if (accountTypeElement) {
      accountTypeElement.textContent = `Account Type: ${user.accountType}`;
    }
  }
}
