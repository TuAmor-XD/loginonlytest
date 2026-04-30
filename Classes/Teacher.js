const pool = require("../../db/dbconnection");

class Teacher {
    constructor(id, name, email, homeroom) {
        this.teacherID = id;
        this.name = name;
        this.email = email;
        this.homeroom = homeroom;
    }

    async save() {
        const result = await pool.query(
            `INSERT INTO teachers (name, email, homeroom)
             VALUES ($1,$2,$3) RETURNING teacher_id`,
            [this.name, this.email, this.homeroom]
        );

        this.teacherID = result.rows[0].teacher_id;
        return this.teacherID;
    }

    static async getAll() {
        const result = await pool.query(
            "SELECT * FROM teachers ORDER BY teacher_id"
        );
        return result.rows;
    }

    static async getById(id) {
        const result = await pool.query(
            "SELECT * FROM teachers WHERE teacher_id = $1",
            [id]
        );

        return result.rows[0] || null;
    }
}

module.exports = Teacher;