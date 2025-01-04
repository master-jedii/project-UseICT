const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2"); // ใช้ MySQL (หรือเปลี่ยนเป็น DB ที่คุณใช้งาน)
const jwt = require("jsonwebtoken"); // ใช้ JWT สำหรับการสร้าง Token
const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:3000', // ให้ frontend ที่รันที่ localhost:3000 สามารถเข้าถึงได้
  methods: 'GET,POST',
}));

// Body parser
app.use(express.json());

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // รหัสผ่าน MySQL ของคุณ
  database: "project-useict", // ชื่อฐานข้อมูล
});

// เชื่อมต่อฐานข้อมูล
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database!");
});

app.get('/main', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // ดึง token จาก header
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' }); // ถ้าไม่มี token
    }
  
    jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => { // ตรวจสอบ token
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' }); // ถ้า token ไม่ถูกต้อง
      }
  
      const userId = decoded.id;
      const userFirstname = decoded.firstname;
      res.status(200).json({ user: { id: userId, firstname: userFirstname } }); // ส่งข้อมูลกลับ
    });
  });
  

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // ตรวจสอบผู้ใช้ในฐานข้อมูล
    const query = "SELECT * FROM users WHERE email = ?";
    db.execute(query, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const user = results[0]; // สมมติว่า email มีเพียง 1 รายการเท่านั้น
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // เปรียบเทียบรหัสผ่าน
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // สร้าง JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email, firstname: user.firstname },
        'your_jwt_secret_key', // ใส่ secret key ที่ปลอดภัย
        { expiresIn: '1h' } // กำหนดระยะเวลาหมดอายุของ token
      );

      // ส่ง Token และข้อมูลของผู้ใช้กลับไป
      res.status(200).json({
        message: 'Login successful!',
        token,
        user: {
          firstname: user.firstname, // ส่งข้อมูล firstname กลับไป
        }
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/signup', async (req, res) => {
    const { UserID, firstname, lastname, grade, branch, email, password, phone_number } = req.body;
  
    // ตรวจสอบว่า UserID ซ้ำหรือไม่
    const userIdExists = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE UserID = ?', [UserID], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length > 0); // ถ้ามีแถวที่พบ UserID ซ้ำ
        }
      });
    });
  
    if (userIdExists) {
      return res.status(400).json({ error: 'UserID already exists' });
    }
  
    // ตรวจสอบว่า email ซ้ำหรือไม่
    const emailExists = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length > 0); // ถ้ามีแถวที่พบ email ซ้ำ
        }
      });
    });
  
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }
  
    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // เพิ่มข้อมูลผู้ใช้ใหม่
    const query = 'INSERT INTO users (UserID, firstname, lastname, grade, branch, email, password, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [UserID, firstname, lastname, grade, branch, email, hashedPassword, phone_number];
  
    db.query(query, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving user' });
      }
      res.status(200).json({ message: 'User registered successfully' });
    });
  });
  
  
  

// เริ่มเซิร์ฟเวอร์
app.listen(3333, () => {
  console.log("Server running on http://localhost:3333");
});
