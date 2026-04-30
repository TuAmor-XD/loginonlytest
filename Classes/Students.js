const pool = require("../../db/dbconnection");

class Student {
    constructor(id, fName, lName, email, classroom) {
        this.studentID = id;
        this.firstName = fName;
        this.lastName = lName;
        this.email = email;
        this.classroom = classroom;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    async save() {
        const result = await pool.query(
            `INSERT INTO students (first_name, last_name, email, classroom)
             VALUES ($1,$2,$3,$4) RETURNING student_id`,
            [this.firstName, this.lastName, this.email, this.classroom]
        );

        this.studentID = result.rows[0].student_id;
        return this.studentID;
    }

    static async getAll() {
        const result = await pool.query(
            "SELECT * FROM students ORDER BY student_id"
        );
        return result.rows;
    }

    static async getById(id) {
        const result = await pool.query(
            "SELECT * FROM students WHERE student_id = $1",
            [id]
        );

        return result.rows[0] || null;
    }
}

module.exports = Student;