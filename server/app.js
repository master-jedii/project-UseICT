const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2"); // ใช้ MySQL (หรือเปลี่ยนเป็น DB ที่คุณใช้งาน)
const jwt = require("jsonwebtoken"); // ใช้ JWT สำหรับการสร้าง Token
const app = express();
const multer = require('multer');
const router = express.Router();
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
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token', error: err.message });
    }

    console.log("Decoded JWT payload:", decoded);  // ✅ เช็ค decoded payload

    const userId = decoded.UserID;  // ตรวจสอบว่า UserID อยู่ใน decoded หรือไม่
    const userFirstname = decoded.firstname;

    // ส่งข้อมูล userId และ firstname
    res.status(200).json({ user: { id: userId, firstname: userFirstname } });
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

      // สร้าง JWT Token โดยเพิ่ม role เข้าไปด้วย
      const token = jwt.sign(
        { UserID: user.UserID, email: user.email, firstname: user.firstname, role: user.role }, // role ถูกเพิ่มใน payload
        'your_jwt_secret_key', // ใส่ secret key ที่ปลอดภัย
        { expiresIn: '1h' } // กำหนดระยะเวลาหมดอายุของ token
      );

      // ส่ง Token และข้อมูลของผู้ใช้กลับไป
      res.status(200).json({
        message: 'Login successful!',
        token,
        user: {
          UserID: user.UserID,  // ส่งข้อมูล UserID กลับไปด้วย
          firstname: user.firstname,
          role: user.role,     // ส่ง role ของผู้ใช้กลับไป
        }
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






app.post('/signup', async (req, res) => {
  const { UserID, firstname, lastname, grade, branch, email, password, phone_number, role } = req.body;
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

  // เพิ่มข้อมูลผู้ใช้ใหม่พร้อมกับ role (โดย role จะเป็น 'user' สำหรับผู้ใช้ทั่วไป)
  const query = 'INSERT INTO users (UserID, firstname, lastname, grade, branch, email, password, phone_number, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [UserID, firstname, lastname, grade, branch, email, hashedPassword, phone_number, role];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error saving user' });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
});



app.get('/admin', (req, res) => {
  const token = req.headers['authorization'];  // ดึง token จาก header

  if (!token) {
    return res.status(401).json({ message: 'ไม่พบ token กรุณาล็อกอิน' });
  }

  // เช็คว่า token มีรูปแบบ "Bearer <token>" หรือไม่
  if (!token.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Token format is incorrect' });
  }

  const actualToken = token.slice(7); // เอา "Bearer " ออกไป

  try {
    const decodedToken = jwt.verify(actualToken, 'yourSecretKey');  // ถอดรหัส token
    const role = decodedToken.role;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'คุณไม่ใช่ admin' }); // ถ้าไม่ใช่ admin
    }

    // ถ้าเป็น admin ให้ส่งข้อมูลของหน้า admin
    res.send('Welcome to Admin page');
  } catch (error) {
    res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }
});


app.get('/checkRole', (req, res) => {
  const { userID, email } = req.query;

  // ตรวจสอบว่ามีการส่ง userID และ email หรือไม่
  if (!userID || !email) {
    return res.status(400).json({ error: 'Missing userID or email' });
  }
  // คำสั่ง SQL เพื่อดึงข้อมูล role ของ user
  const query = 'SELECT role FROM users WHERE userID = ? AND email = ?';
  db.query(query, [userID, email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length > 0) {
      const role = results[0].role;  // สมมติว่า role อยู่ในคอลัมน์ role
      res.json({ role });
    } else {
      res.status(404).json({ error: 'User not found' });
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

// กรณีอัปโหลดหลายฟิลด์
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



app.get('/api/equipment', (req, res) => {
  // เลือกเฉพาะ column equipment_id และ name
  const query = "SELECT equipment_id, name FROM equipment";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching equipment data:", err);
      return res.status(500).json({ message: "Error fetching equipment data" });
    }

    // ส่งเฉพาะข้อมูลที่เลือกกลับไปในรูปแบบ JSON
    res.status(200).json(result);
  });
});





app.post('/api/borrow', (req, res) => {
  const { UserID, equipmentId, subject, name, place, objective, borrow_d, return_d } = req.body;

  if (!UserID || !equipmentId || !subject || !name || !place || !objective || !borrow_d || !return_d) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  // คำสั่ง SQL ที่จะตั้งค่า status เป็น 'รอดำเนินการ'
  const query = `
    INSERT INTO borrow (UserID, subject, objective, place, borrow_date, return_date, equipment_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'รอดำเนินการ')
  `;

  db.execute(query, [UserID, subject, objective, place, borrow_d, return_d, equipmentId], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);  // แสดงข้อผิดพลาด SQL
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }

    res.status(200).json({ message: 'บันทึกข้อมูลสำเร็จ' });
  });
});









//dashboard
app.get('/equipment-stats', (req, res) => {
  const query = `
    SELECT category, COUNT(*) as count
    FROM equipment
    GROUP BY category;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching equipment stats:', err);
      return res.status(500).json({ message: 'Error fetching equipment stats' });
    }

    // แปลงผลลัพธ์ให้อยู่ในรูปแบบ JSON ที่อ่านง่าย
    const stats = results.reduce((acc, row) => {
      acc[row.category] = row.count;
      return acc;
    }, {});

    res.json(stats); // ส่งข้อมูลกลับ
  });
});

// API แสดงรายการอุปกรณ์ทั้งหมดหรือกรองตามหมวดหมู่
app.get('/showequipment', (req, res) => {
  const { category } = req.query; // รับค่าหมวดหมู่จาก query string

  let query = "SELECT * FROM equipment";
  const params = [];

  if (category && category !== "ทั้งหมด") {
    query += " WHERE category = ?";
    params.push(category);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching equipment:', err);
      return res.status(500).json({ message: 'Error fetching equipment' });
    }
    res.json(results); // ส่งข้อมูลกลับในรูปแบบ JSON
  });
});


// ตัวอย่างการกรองข้อมูลตาม type_id ใน Backend
app.get("/showequipment/type/:typeId", (req, res) => {
  const { typeId } = req.params;  // รับค่า typeId จาก URL path

  const query = "SELECT * FROM equipment WHERE type_id = ?";
  
  db.query(query, [typeId], (err, result) => {
    if (err) {
      console.log("เกิดข้อผิดพลาดอะไรบางอย่าง", err);
      return res.status(500).json({ message: "Error fetching equipment" });
    } else {
      res.send(result); // ส่งข้อมูลที่กรองตาม type_id
    }
  });
});



//ดึงข้อมูลผู้ใช้งาน dashboard
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching users');
    } else {
      res.json(results);
    }
  });
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

app.post('/api/addserial', (req, res) => {
  const { type_serial, type_id } = req.body;
  const query = 'INSERT INTO serialnumber (type_serial, type_id) VALUES (?, ?)';
  
  db.query(query, [type_serial, type_id], (err, result) => {
    if (err) {
      console.error('Error inserting serial number:', err);
      return res.status(500).json({ message: 'Error inserting serial number' });
    }
    res.status(200).json({ message: 'เพิ่มรหัสอุปกรณ์สำเร็จ' });
  });
});









// เริ่มเซิร์ฟเวอร์
app.listen(3333, () => {
  console.log("Server running on http://localhost:3333");
});