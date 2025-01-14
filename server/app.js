const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2"); // ใช้ MySQL (หรือเปลี่ยนเป็น DB ที่คุณใช้งาน)
const jwt = require("jsonwebtoken"); // ใช้ JWT สำหรับการสร้าง Token
const app = express();
const multer = require('multer');

const path = require("path");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
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
  
  app.get('/admin', (req, res) => {
    db.query("SELECT * FROM equipment", (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    })
});



// แสดงรายการอุปกรณ์
app.get("/admin", (req, res) => {
  db.query("SELECT * FROM equipment", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});





// ตั้งค่าการเก็บไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // เก็บไฟล์ในโฟลเดอร์ uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์เป็น timestamp
  },
});

const upload = multer({ storage: storage });

// Endpoint สำหรับเพิ่มอุปกรณ์ใหม่
app.post("/create", upload.fields([{ name: "image", maxCount: 1 }]), (req, res) => {
  // รับค่าจาก frontend
  const { name, description, category, type_id, status } = req.body;  // เพิ่ม type_id และ status
  const image = req.files?.image ? req.files.image[0].filename : null;

  // แสดงค่าที่ได้รับมาจาก frontend
  console.log("Received data:", { name, description, category, type_id, status, image });

  // คำสั่ง SQL สำหรับการเพิ่มข้อมูล
  db.query(
    "INSERT INTO equipment (name, description, category, image, status, type_id) VALUES (?, ?, ?, ?, ?, ?)",  // เพิ่ม type_id
    [name, description, category, image, status, type_id],  // ส่ง type_id เข้าไปด้วย
    (err, result) => {
      if (err) {
        console.log("Error inserting equipment:", err);
        // ลบไฟล์หากเกิดข้อผิดพลาด
        if (image) {
          fs.unlinkSync(path.join(__dirname, 'uploads', image));
        }
        return res.status(500).json({ message: "Error saving equipment" });
      }

      res.status(200).json({ message: "Equipment added successfully", equipmentId: result.insertId });
    }
  );
});


// ดึงข้อมูลจากตาราง serialnumber
app.get("/api/serialtypes", (req, res) => {
  const query = 'SELECT type_id, type_serial FROM serialnumber'; // เปลี่ยนเป็น query ที่คุณใช้
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching serial types:", err);
      return res.status(500).json({ message: 'Error fetching serial types' });
    }
    res.status(200).json(result); // ส่งข้อมูลที่ได้รับจากฐานข้อมูล
  });
});






// แสดงรายการอุปกรณ์พร้อมกรองหมวดหมู่
app.get("/showequipment", (req, res) => {
  const { category } = req.query;  // รับค่าหมวดหมู่จาก query string

  // ถ้ามีหมวดหมู่ให้กรองตามหมวดหมู่
  let query = "SELECT * FROM equipment";
  if (category && category !== 'ทั้งหมด') {
    query += " WHERE category = ?";
  }

  db.query(query, [category], (err, result) => {
    if (err) {
      console.log("เกิดข้อผิดพลาดอะไรบางอย่าง", err);
      return res.status(500).json({ message: "Error fetching equipment" });
    } else {
      res.send(result); // ส่งข้อมูลที่กรองแล้ว
    }
  });
});





// fetch ในหน้าแต่ละอุปกรณ์
app.get("/showcategory", (req, res) => {
  const { category } = req.query; // รับค่าหมวดหมู่จาก query string

  // สร้าง query พื้นฐาน
  let query = "SELECT * FROM equipment";
  const queryParams = [];

  // ถ้ามีหมวดหมู่ที่ระบุ กรองตามหมวดหมู่
  if (category && category !== "ทั้งหมด") {
    query += " WHERE category = ?";
    queryParams.push(category);
  }

  // รัน query
  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาด:", err);
      return res.status(500).json({ message: "Error fetching equipment" });
    }

    // ส่งข้อมูลกลับ client
    res.json(result);
  });
});


app.delete('/api/equipments/:id', (req, res) => {
  const equipmentId = req.params.id;

  // สร้าง query SQL สำหรับลบอุปกรณ์ที่มี equipment_id
  const query = 'DELETE FROM equipment WHERE equipment_id = ?';

  db.query(query, [equipmentId], (err, result) => {
    if (err) {
      console.error('Error deleting equipment:', err);
      return res.status(500).json({ message: 'Error deleting equipment' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.status(200).json({ message: 'Equipment deleted successfully' });
  });
});

app.put('/api/equipments/:id', upload.single('image'), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description, category } = req.body;
  const image = req.file ? req.file.filename : null;

  // คำสั่ง SQL สำหรับอัปเดตข้อมูล
  const query = `
      UPDATE equipment 
      SET 
          name = ?, 
          description = ?, 
          category = ?, 
          image = COALESCE(?, image) 
      WHERE 
          equipment_id = ?`;

  db.query(query, [name, description, category, image, id], (err, result) => {
      if (err) {
          console.error('Failed to update equipment:', err);
          return res.status(500).json({ message: 'Database update failed' });
      }

      res.json({ message: 'Equipment updated successfully!', updatedId: id });
  });
});









app.post('/api/borrow', (req, res) => {
  const borrowData = req.body; // รับข้อมูลที่ส่งมาจาก client
  console.log("Received data:", borrowData); // ตรวจสอบข้อมูลที่ได้รับจาก client

  // ตรวจสอบข้อมูลที่ได้รับ
  if (!borrowData.subject || !borrowData.objective || !borrowData.place || !borrowData.borrow_d || !borrowData.return_d) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  const query = `
    INSERT INTO borrow (subject, objective, place, borrow_d, return_d)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    borrowData.subject,
    borrowData.objective,  // ใช้ objective แทน equipment
    borrowData.place,      // ใช้ place แทน location
    borrowData.borrow_d,   // ใช้ borrow_d แทน borrowDate
    borrowData.return_d    // ใช้ return_d แทน returnDate
  ];

  console.log("SQL values:", values); // ตรวจสอบข้อมูลที่จะส่งไปยังฐานข้อมูล

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล' });
    }

    // ส่งข้อความตอบกลับเมื่อบันทึกข้อมูลสำเร็จ
    res.status(200).json({ message: 'เพิ่มข้อมูลการยืมสำเร็จ!', borrow_id: result.insertId });
  });
});










// เริ่มเซิร์ฟเวอร์
app.listen(3333, () => {
  console.log("Server running on http://localhost:3333");
});
