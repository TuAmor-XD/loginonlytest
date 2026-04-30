const Student = require("./Student");
const Teacher = require("./Teacher");
const Course = require("./Course");

class Admin {

    static async getDashboardStats() {
        const students = await Student.getAll();
        const teachers = await Teacher.getAll();
        const courses = await Course.getAll();

        return {
            totalStudents: students.length,
            totalTeachers: teachers.length,
            totalCourses: courses.length
        };
    }
}

module.exports = Admin;