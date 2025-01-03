const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const jsonParser = bodyParser.json();

// สร้างการเชื่อมต่อกับฐานข้อมูล
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // ระบุรหัสผ่านของคุณ
    database: 'project-useict' // ระบุชื่อฐานข้อมูล
});

// ตรวจสอบว่าการเชื่อมต่อทำงานได้
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

app.post('/register', jsonParser, function (req, res, next) {
    const { 
        UserID, 
        firstname, 
        lastname, 
        grade, 
        branch, 
        email, 
        password, 
        phone_number 
    } = req.body; // ดึงข้อมูลจาก request body

    // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
    if (!UserID || !firstname || !lastname || !grade || !branch || !email || !password || !phone_number) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // สร้างคำสั่ง SQL สำหรับการ Insert
    const insertQuery = `
        INSERT INTO users (UserID, firstname, lastname, grade, branch, email, password, phone_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // ดำเนินการคำสั่ง SQL
    connection.execute(
        insertQuery,
        [UserID, firstname, lastname, grade, branch, email, password, phone_number], // ข้อมูลจาก request body
        function (err, results) {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Database error' }); // ส่งข้อความข้อผิดพลาด
            }

            console.log('Insert Results:', results);

            // ตอบกลับเมื่อสำเร็จ
            res.json({
                message: 'User registered successfully',
                data: {
                    UserID,
                    firstname,
                    lastname,
                    grade,
                    branch,
                    email,
                    phone_number
                }
            });
        }
    );
});

// เริ่มเซิร์ฟเวอร์
const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
