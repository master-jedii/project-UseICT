const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');  // ติดตั้งและนำเข้า cors

const app = express();
const jsonParser = bodyParser.json();

// ใช้ CORS middleware ให้กับเซิร์ฟเวอร์ของเรา
app.use(cors());  // ทำให้สามารถรับคำขอจากทุกโดเมน

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

// Route สำหรับการสมัครสมาชิก (Register)
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

// Route สำหรับการล็อกอิน (Login)
app.post('/login', jsonParser, function (req, res, next) {
    const { email, password } = req.body;

    // ตรวจสอบข้อมูลที่ได้จากฟอร์ม
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

    connection.execute(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});


// Route สำหรับตรวจสอบ UserID หรือ Email ซ้ำ
app.post('/check-duplicate', jsonParser, function (req, res, next) {
    const { UserID, email } = req.body;

    // ตรวจสอบว่ามี UserID หรือ Email อยู่ในฐานข้อมูลหรือไม่
    const query = `
        SELECT * FROM users 
        WHERE UserID = ? OR email = ?
    `;

    connection.execute(query, [UserID, email], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // ตรวจสอบผลลัพธ์
        if (results.length > 0) {
            res.status(200).json({ exists: true }); // มีข้อมูลซ้ำ
        } else {
            res.status(200).json({ exists: false }); // ไม่มีข้อมูลซ้ำ
        }
    });
});

// เริ่มเซิร์ฟเวอร์
const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(cors({
    origin: 'http://localhost:3000'  // จะอนุญาตให้เข้าถึงเฉพาะจาก localhost:3000
}));
