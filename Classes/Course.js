const pool = require("../../db/dbconnection");

class Course {
    constructor(id, title, teacherID) {
        this.courseID = id;
        this.title = title;
        this.teacherID = teacherID;
    }

    async save() {
        const result = await pool.query(
            `INSERT INTO courses (title, teacher_id)
             VALUES ($1,$2) RETURNING course_id`,
            [this.title, this.teacherID]
        );

        this.courseID = result.rows[0].course_id;
        return this.courseID;
    }

    static async getAll() {
        const result = await pool.query(
            "SELECT * FROM courses"
        );
        return result.rows;
    }

    static async getById(id) {
        const result = await pool.query(
            "SELECT * FROM courses WHERE course_id = $1",
            [id]
        );

        return result.rows[0] || null;
    }
}

module.exports = Course;