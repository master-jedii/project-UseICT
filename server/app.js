const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');  // เพิ่มการใช้งาน jsonwebtoken

const app = express();
const jsonParser = bodyParser.json();

// ใช้ CORS middleware ให้กับเซิร์ฟเวอร์ของเรา
app.use(cors());

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

// Secret key สำหรับการสร้างและตรวจสอบ JWT token
const SECRET_KEY = 'your_secret_key'; // เก็บใน environment variable ควรปลอดภัย

// Middleware สำหรับตรวจสอบ JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // อ่าน token จาก Authorization header

    if (!token) {
        return res.status(403).json({ error: 'Token is required' });
    }

    // ตรวจสอบว่า token ถูกต้องหรือไม่
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user; // เก็บข้อมูล user ที่ถูกถอดรหัสใน request
        next(); // ข้ามไปยัง route ถัดไป
    });
};

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
    } = req.body;

    if (!UserID || !firstname || !lastname || !grade || !branch || !email || !password || !phone_number) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const insertQuery = `
        INSERT INTO users (UserID, firstname, lastname, grade, branch, email, password, phone_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.execute(
        insertQuery,
        [UserID, firstname, lastname, grade, branch, email, password, phone_number],
        function (err, results) {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({
                message: 'User registered successfully',
                data: { UserID, firstname, lastname, grade, branch, email, phone_number }
            });
        }
    );
});

// Route สำหรับการล็อกอิน (Login) พร้อมสร้าง JWT token
app.post('/login', jsonParser, function (req, res, next) {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

    connection.execute(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            // ถ้าผู้ใช้ล็อกอินสำเร็จ, สร้าง JWT token
            const user = results[0];
            const token = jwt.sign({ id: user.UserID, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});

// Route สำหรับตรวจสอบ UserID หรือ Email ซ้ำ
app.post('/check-duplicate', jsonParser, function (req, res, next) {
    const { UserID, email } = req.body;

    const query = `
        SELECT * FROM users 
        WHERE UserID = ? OR email = ?
    `;

    connection.execute(query, [UserID, email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    });
});


// Route สำหรับการเข้าถึง Dashboard ที่ต้องการการตรวจสอบ JWT token
app.get('/dashboard', authenticateToken, (req, res) => {
    const userId = req.user.id;  // ดึง UserID จากข้อมูลใน JWT token
    const query = 'SELECT firstname FROM users WHERE UserID = ?';
    connection.execute(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            const user = results[0];
            res.json({ message: 'Welcome to the dashboard!', user: user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});



// เริ่มเซิร์ฟเวอร์
const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
