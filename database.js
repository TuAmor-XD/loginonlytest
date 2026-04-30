/**
 * Client-Side Database Module
 * Uses localStorage to simulate a database for user authentication
 * 
 * Account Types:
 * - 'admin': Admin users (user IDs starting with 1)
 * - 'teacher': Teacher users (user IDs starting with 2)
 * - 'student': Student users (user IDs starting with any other digit)
 */

const DB_KEY = 'school_portal_database';

// Initialize database with default admin account
function initDatabase() {
    const db = getDatabase();
    
    // Create default admin account if not exists
    if (!db.users || db.users.length === 0) {
        db.users = [
            {
                userID: '100000001',
                password: 'admin123', // Default password - should be changed
                accountType: 'admin',
                firstName: 'System',
                lastName: 'Administrator',
                email: 'admin@school.edu',
                createdAt: new Date().toISOString(),
                isActive: true
            }
        ];
        db.studentIDCounter = 202400001;
        db.teacherIDCounter = 2000001;
        saveDatabase(db);
        console.log('Database initialized with default admin account');
        console.log('Default Admin - UserID: 100000001, Password: admin123');
    }
    
    return db;
}

// Get database from localStorage
function getDatabase() {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        users: [],
        studentIDCounter: 202400001,
        teacherIDCounter: 2000001,
        generatedStudentIDs: [] // Track admin-generated student IDs
    };
}

// Save database to localStorage
function saveDatabase(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Check if user exists in database
function userExists(userID) {
    const db = getDatabase();
    return db.users.some(user => user.userID === userID);
}

// Validate user credentials
function validateCredentials(userID, password) {
    const db = getDatabase();
    const user = db.users.find(u => u.userID === userID);
    
    if (!user) {
        return { success: false, message: 'User not found' };
    }
    
    if (!user.isActive) {
        return { success: false, message: 'Account is deactivated' };
    }
    
    if (user.password !== password) {
        return { success: false, message: 'Invalid password' };
    }
    
    return { 
        success: true, 
        message: 'Login successful',
        user: {
            userID: user.userID,
            accountType: user.accountType,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    };
}

// Get account type based on user ID
function getAccountType(userID) {
    const db = getDatabase();
    const user = db.users.find(u => u.userID === userID);
    
    if (!user) {
        return null;
    }
    
    return user.accountType;
}

// Get dashboard URL based on account type
function getDashboardURL(accountType) {
    const routes = {
        'admin': './Dashboards/Admin-Dash/admin.html',
        'teacher': './Dashboards/Teachers-Dash/teachers-dash.html',
        'student': './Dashboards/Students-Dash/students-dash.html'
    };
    
    return routes[accountType] || null;
}

// Login function - main authentication entry point
function login(userID, password) {
    // Initialize database if not already done
    initDatabase();
    
    // Step 1: Check if user exists in DB
    if (!userExists(userID)) {
        return { 
            success: false, 
            message: 'User not found. Please contact admin to create an account.',
            redirect: null
        };
    }
    
    // Step 2: Check credentials are correct
    const validation = validateCredentials(userID, password);
    if (!validation.success) {
        return {
            success: false,
            message: validation.message,
            redirect: null
        };
    }
    
    // Step 3: Check account type in DB
    const accountType = getAccountType(userID);
    if (!accountType) {
        return {
            success: false,
            message: 'Unable to determine account type',
            redirect: null
        };
    }
    
    // Step 4: Get appropriate dashboard based on account type
    const dashboardURL = getDashboardURL(accountType);
    if (!dashboardURL) {
        return {
            success: false,
            message: 'No dashboard configured for this account type',
            redirect: null
        };
    }
    
    // Store session information
    sessionStorage.setItem('currentUser', JSON.stringify(validation.user));
    sessionStorage.setItem('loginTime', new Date().toISOString());
    
    return {
        success: true,
        message: 'Login successful',
        redirect: dashboardURL,
        accountType: accountType,
        user: validation.user
    };
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('loginTime');
}

// Check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

// Get current logged in user
function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Register a new student with admin-assigned ID
function registerStudent(studentID, password, firstName, lastName, email, classroom) {
    initDatabase();
    const db = getDatabase();
    
    // Check if student ID was generated by admin
    const isGeneratedID = db.generatedStudentIDs.includes(studentID);
    if (!isGeneratedID) {
        return {
            success: false,
            message: 'This student ID was not assigned by admin. Please contact admin.'
        };
    }
    
    // Check if user already exists
    if (userExists(studentID)) {
        return {
            success: false,
            message: 'This student ID is already registered.'
        };
    }
    
    // Create new student user
    const newUser = {
        userID: studentID,
        password: password,
        accountType: 'student',
        firstName: firstName,
        lastName: lastName,
        email: email,
        classroom: classroom,
        createdAt: new Date().toISOString(),
        isActive: true
    };
    
    db.users.push(newUser);
    
    // Remove from generated IDs list as it's now registered
    db.generatedStudentIDs = db.generatedStudentIDs.filter(id => id !== studentID);
    
    saveDatabase(db);
    
    return {
        success: true,
        message: 'Registration successful! You can now login.',
        userID: studentID
    };
}

// Admin function: Generate a new student ID
function generateStudentID() {
    initDatabase();
    const db = getDatabase();
    
    const newID = db.studentIDCounter.toString();
    db.studentIDCounter++;
    db.generatedStudentIDs.push(newID);
    
    saveDatabase(db);
    
    return {
        success: true,
        studentID: newID,
        message: `Student ID ${newID} generated. Share this with the student for registration.`
    };
}

// Admin function: Generate multiple student IDs
function generateMultipleStudentIDs(count) {
    const ids = [];
    for (let i = 0; i < count; i++) {
        const result = generateStudentID();
        ids.push(result.studentID);
    }
    return ids;
}

// Admin function: Create a teacher account
function createTeacherAccount(teacherID, password, name, email, homeroom) {
    initDatabase();
    const db = getDatabase();
    
    if (userExists(teacherID)) {
        return {
            success: false,
            message: 'Teacher ID already exists.'
        };
    }
    
    const newUser = {
        userID: teacherID,
        password: password,
        accountType: 'teacher',
        name: name,
        email: email,
        homeroom: homeroom,
        createdAt: new Date().toISOString(),
        isActive: true
    };
    
    db.users.push(newUser);
    saveDatabase(db);
    
    return {
        success: true,
        message: 'Teacher account created successfully.'
    };
}

// Admin function: Get all users
function getAllUsers() {
    initDatabase();
    const db = getDatabase();
    return db.users.map(user => ({
        userID: user.userID,
        accountType: user.accountType,
        firstName: user.firstName || user.name,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        isActive: user.isActive
    }));
}

// Admin function: Deactivate/Activate user
function toggleUserStatus(userID, isActive) {
    initDatabase();
    const db = getDatabase();
    const user = db.users.find(u => u.userID === userID);
    
    if (!user) {
        return { success: false, message: 'User not found' };
    }
    
    user.isActive = isActive;
    saveDatabase(db);
    
    return {
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully.`
    };
}

// Export functions for use in other modules (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDatabase,
        getDatabase,
        saveDatabase,
        userExists,
        validateCredentials,
        getAccountType,
        getDashboardURL,
        login,
        logout,
        isLoggedIn,
        getCurrentUser,
        registerStudent,
        generateStudentID,
        generateMultipleStudentIDs,
        createTeacherAccount,
        getAllUsers,
        toggleUserStatus
    };
}

// Expose DB object globally for browser use
if (typeof window !== 'undefined') {
    window.DB = {
        initDatabase,
        getDatabase,
        saveDatabase,
        userExists,
        validateCredentials,
        getAccountType,
        getDashboardURL,
        login,
        logout,
        isLoggedIn,
        getCurrentUser,
        registerStudent,
        generateStudentID,
        generateMultipleStudentIDs,
        createTeacherAccount,
        getAllUsers,
        toggleUserStatus
    };
}