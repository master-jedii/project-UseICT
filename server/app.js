import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import mysql  from "mysql2"; // ใช้ MySQL (หรือเปลี่ยนเป็น DB ที่คุณใช้งาน)
import jwt  from "jsonwebtoken"; // ใช้ JWT สำหรับการสร้าง Token
const app = express();
import multer  from 'multer';
const router = express.Router();
import path  from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
// CORS
app.use(cors({
  origin: 'http://localhost:3000', // ให้ frontend ที่รันที่ localhost:3000 สามารถเข้าถึงได้
  methods: 'GET,POST',
}));

// Body parser
app.use(express.json());


//socket
const io = new Server(5000, {
  cors: {
    origin: "http://localhost:3000", // URL ของ Client
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  io.emit("firstEvent","hellow this is it test!")

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const notifications = {}; // เก็บการแจ้งเตือนตาม userId

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;  // ดึง userId จาก query string หรือจาก session
  // ฟัง event 'borrowApproved'
  socket.on("borrowApproved", (notification) => {
    console.log("Borrow approved notification for user:", userId);

    // เก็บการแจ้งเตือนใน memory (หรือฐานข้อมูล)
    if (!notifications[userId]) {
      notifications[userId] = [];
    }
    notifications[userId].push(notification);

    // ส่งการแจ้งเตือนให้ผู้ใช้
    io.to(socket.id).emit("borrowApproved", notification);
  });
  // เมื่อ socket disconnect, ลบการแจ้งเตือนของผู้ใช้
  socket.on("disconnect", () => {
    delete notifications[userId];
  });
});



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


// USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER // 

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

  // คำสั่ง SQL ที่จะตั้งค่า status เป็น 'รอดำเนินการ' และบันทึก timestamp
  const query = `
    INSERT INTO borrow (UserID, subject, objective, place, borrow_date, return_date, equipment_id, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'รอดำเนินการ', CURRENT_TIMESTAMP)  -- ตั้งค่า created_at เป็นเวลาปัจจุบัน
  `;

  db.execute(query, [UserID, subject, objective, place, borrow_d, return_d, equipmentId], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);  // แสดงข้อผิดพลาด SQL
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }

    const borrowId = result.insertId; // ใช้ borrowId ที่ได้จากการแทรกข้อมูลเข้าไปในตาราง borrow

    // คำสั่ง SQL สำหรับบันทึกข้อมูลการแจ้งเตือนในตาราง notifications
    const notificationQuery = `
      INSERT INTO notifications (equipment_id, borrow_id, UserID, subject, objective, place, borrow_date, return_date, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'รอดำเนินการ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    // เปลี่ยนจาก borrowId เป็น equipmentId ในการส่งค่า
    db.execute(notificationQuery, [equipmentId, borrowId, UserID, subject, objective, place, borrow_d, return_d], (err, notificationResult) => {
      if (err) {
        console.error('Error executing SQL query for notifications:', err);  // แสดงข้อผิดพลาด SQL สำหรับ notifications
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการแจ้งเตือน' });
      }

      // การอัปเดตสถานะของ borrow และ notifications
      const updateStatusQuery = `
        UPDATE borrow
        SET status = 'รอดำเนินการ'
        WHERE borrow_id = ?
      `;

      db.execute(updateStatusQuery, [borrowId], (err, updateResult) => {
        if (err) {
          console.error('Error updating borrow status:', err);
          return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะของการยืม' });
        }

        // อัปเดตสถานะของการแจ้งเตือนใน notifications
        const updateNotificationQuery = `
          UPDATE notifications
          SET status = 'รอดำเนินการ'
          WHERE borrow_id = ?
        `;

        db.execute(updateNotificationQuery, [borrowId], (err, notificationUpdateResult) => {
          if (err) {
            console.error('Error updating notification status:', err);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะการแจ้งเตือน' });
          }

          // ส่ง response กลับไปที่ client
          res.status(200).json({ message: 'บันทึกข้อมูลสำเร็จและการแจ้งเตือนถูกสร้าง' });
        });
      });
    });
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


app.get('/api/borrow-status', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const userId = decoded.UserID;

    // Query ดึงข้อมูลจากตาราง borrow, equipment และ users
    const query = `
      SELECT 
        b.borrow_id, 
        e.name AS equipment_name, 
        b.equipment_id, 
        b.borrow_date, 
        b.return_date, 
        b.created_at, 
        b.status,
        b.objective,
        b.place,
        u.UserID, 
        u.firstname, 
        u.lastname, 
        u.grade, 
        u.branch, 
        u.email,
        u.phone_number
      FROM borrow b
      JOIN equipment e ON b.equipment_id = e.equipment_id
      JOIN users u ON b.UserID = u.UserID
      WHERE b.UserID = ?
    `;

    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error fetching borrow status:', error);
        return res.status(500).json({ message: 'Error fetching borrow status' });
      }

      res.json(results);
    });
  });
});


///ลบคำขอ

app.delete("/api/borrow-status/:id",  (req, res) => {
  const borrowId = req.params.id;

  const sql = "DELETE FROM borrow WHERE borrow_id = ?";
  db.query(sql, [borrowId], (err, result) => {
    if (err) {
      console.error("Error deleting borrow request:", err);
      return res.status(500).send("Error deleting request");
    }
    res.status(200).send("Borrow request cancelled successfully");
  });
});




app.get('/api/notifications', (req, res) => {
  const { userId, borrowId } = req.query;  // เพิ่มการดึง borrowId หากต้องการเจาะจง borrow_id

  if (!userId) {
    console.error('User ID is required but not provided');
    return res.status(400).json({ message: 'User ID is required' });
  }

  console.log('Received User ID:', userId);

  // ถ้ามี borrowId ให้ใช้ในการกรองข้อมูลเพิ่มเติม
  const borrowIdCondition = borrowId ? 'AND n.borrow_id = ?' : ''; // ตรวจสอบว่ามี borrowId หรือไม่

  const query = `
    SELECT 
      n.notification_id AS id,
      n.borrow_id,
      n.UserID,
      n.subject,
      n.objective,
      n.place,
      n.borrow_date,
      n.return_date,
      n.status,
      n.created_at,
      n.updated_at,
      e.equipment_id,
      e.name AS equipment_name  -- เพิ่มคอลัมน์ชื่ออุปกรณ์จากตาราง equipment
    FROM notifications n
    LEFT JOIN equipment e ON e.equipment_id = n.equipment_id  -- เชื่อมโยง borrow_id กับ equipment_id
    WHERE n.UserID = ?
    ${borrowIdCondition}  -- ถ้ามี borrowId จะเพิ่มเงื่อนไขกรอง
    ORDER BY n.created_at DESC
  `;

  const queryParams = borrowId ? [userId, borrowId] : [userId];  // กำหนดพารามิเตอร์ในการ query

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Database query error', error: err });
    }

    console.log('Query Results:', results);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No notifications found for this user' });
    }

    res.status(200).json(results);
  });
});


app.delete('/api/notifications/:borrowId', (req, res) => {
  const { borrowId } = req.params;

  if (!borrowId) {
    return res.status(400).json({ message: 'Borrow ID is required' });
  }

  const query = 'DELETE FROM notifications WHERE borrow_id = ?';

  db.query(query, [borrowId], (err, result) => {
    if (err) {
      console.error('Error deleting notification:', err);
      return res.status(500).json({ message: 'Error deleting notification', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  });
});
















// #################################################################################################################################################################### //




// ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN ADMIN // 

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


//ใหม่ลบ
app.delete('/api/equipments/:id', (req, res) => {
  const equipmentId = req.params.id;

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

//อันใหม่ update
app.put('/api/equipments/:id', upload.single('image'), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description, category, status, type_id } = req.body;
  const image = req.file ? req.file.filename : null;

  const query = `
    UPDATE equipment 
    SET 
      name = ?, 
      description = ?, 
      category = ?, 
      status = ?, 
      type_id = ?, 
      image = COALESCE(?, image) 
    WHERE 
      equipment_id = ?
  `;

  db.query(query, [name, description, category, status, type_id, image, id], (err, result) => {
    if (err) {
      console.error('Failed to update equipment:', err);
      return res.status(500).json({ message: 'Database update failed' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ message: 'Equipment updated successfully!', updatedId: id });
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



app.get('/api/borrow/all', (req, res) => {
  const query = `
    SELECT b.borrow_id, b.UserID, b.subject, b.objective, b.place, b.borrow_date, b.return_date, b.status, e.name AS equipment_name, b.equipment_id, b.created_at
    FROM borrow b
    JOIN equipment e ON b.equipment_id = e.equipment_id
    ORDER BY b.created_at DESC;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching borrow data:", err);
      return res.status(500).json({ message: 'Error fetching borrow data' });
    }

    // ส่งข้อมูลกลับในรูปแบบ JSON
    res.status(200).json(result);
  });
});

//newborrow
app.get('/api/stats/borrow-return', (req, res) => {
  const query = `
    SELECT 
      MONTH(borrow_date) AS month, 
      COUNT(CASE WHEN status = 'borrowed' THEN 1 END) AS borrowed,
      COUNT(CASE WHEN status = 'returned' THEN 1 END) AS returned
    FROM borrow
    GROUP BY MONTH(borrow_date)
    ORDER BY MONTH(borrow_date);
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching borrow stats:', err);
      return res.status(500).json({ message: 'Error fetching borrow stats' });
    }

    // ส่งข้อมูลในรูปแบบ JSON
    res.status(200).json(result);
  });
});

// month dashboard
app.get('/api/borrow/stats', (req, res) => {
  const query = `
    SELECT 
      MONTH(created_at) AS month, 
      COUNT(*) AS total 
    FROM borrow 
    GROUP BY MONTH(created_at)
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching borrow stats:', err);
      return res.status(500).json({ message: 'Error fetching borrow stats' });
    }

    res.status(200).json(result);
  });
});

app.get('/api/equipment/status', (req, res) => {
  const query = `
    SELECT status, COUNT(*) as count
    FROM equipment
    GROUP BY status;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching equipment status stats:', err);
      return res.status(500).json({ message: 'Error fetching equipment status stats' });
    }
    res.json(results);
  });
});

//top5
app.get('/api/top-borrowed-equipment', (req, res) => {
  const query = `
    SELECT 
      e.name AS equipment_name, 
      COUNT(b.equipment_id) AS borrow_count
    FROM borrow b
    JOIN equipment e 
      ON b.equipment_id = e.equipment_id
    GROUP BY b.equipment_id, e.name
    ORDER BY borrow_count DESC
    LIMIT 5;
  `;

  console.log("Executing query for top borrowed equipment...");

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching top borrowed equipment:', err);
      return res.status(500).json({ message: 'Error fetching top borrowed equipment' });
    }

    console.log("Query result:", result);

    if (!result.length) {
      return res.status(404).json({ message: 'No borrowed equipment found.' });
    }

    res.status(200).json(result);
  });
});


import nodemailer from 'nodemailer';
// เมื่อมีการอัปเดตสถานะการยืม
app.put('/api/borrow/approve/:borrowId', (req, res) => {
  const { borrowId } = req.params;

  const query = `
    UPDATE borrow b
    JOIN equipment e ON b.equipment_id = e.equipment_id
    SET b.status = 'อนุมัติ', e.status = 'อยู่ในระหว่างการใช้งาน'
    WHERE b.borrow_id = ?;
  `;

  db.query(query, [borrowId], (err, result) => {
    if (err) {
      console.error("Error updating borrow status and equipment status:", err.message);
      return res.status(500).json({ message: 'Error updating borrow status and equipment status', error: err.message });
    }

    if (result.affectedRows === 0) {
      console.log("No borrow request found for borrowId:", borrowId);
      return res.status(404).json({ message: 'Borrow request not found' });
    }

    console.log("Borrow request approved and equipment status updated successfully");

    const fetchBorrowDetails = `
      SELECT b.borrow_id, b.status, b.borrow_date, b.return_date, b.UserID, e.name as equipment_name, e.equipment_id, u.email as user_email
      FROM borrow b
      JOIN equipment e ON b.equipment_id = e.equipment_id
      JOIN users u ON b.UserID = u.UserID
      WHERE b.borrow_id = ?;
    `;

    db.query(fetchBorrowDetails, [borrowId], (err, borrowDetails) => {
      if (err) {
        console.error("Error fetching borrow details:", err.message);
        return res.status(500).json({ message: 'Error fetching borrow details', error: err.message });
      }

      if (borrowDetails.length === 0) {
        return res.status(404).json({ message: 'Borrow details not found' });
      }

      const borrowInfo = borrowDetails[0];

      // สร้างข้อความแจ้งเตือน
      const message = `การยืมอุปกรณ์ "${borrowInfo.equipment_name}" ได้รับการอนุมัติแล้ว.`;

      // ส่งข้อมูลผ่าน WebSocket
      io.emit('borrowApproved', {
        borrowDetails: borrowInfo,
        userId: borrowInfo.UserID,
        message: message,
      });

      // ส่งอีเมลแจ้งเตือน
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nusev007x@gmail.com', // อีเมลที่ใช้ส่ง
          pass: 'wfal rddv aweq gnkg',   // รหัสผ่านจาก App Password
        },
      });

      const mailOptions = {
        from: 'nusev007x@gmail.com',
        to: borrowInfo.user_email,   // อีเมลผู้รับ
        subject: 'การอนุมัติการยืมอุปกรณ์', // หัวข้ออีเมล
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  background-color: #009498;
                  color: white;
                  padding: 15px 0;
                  border-radius: 8px 8px 0 0;
                }
                .header img {
                  width: 100px; /* กำหนดขนาดโลโก้ */
                  margin-bottom: 10px;
                }
                .content {
                  padding: 20px;
                  text-align: left;
                  color: #333;
                }
                .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777;
                  margin-top: 20px;
                }
                .button {
                  display: inline-block;
                  background-color: #009498;
                  color: white;
                  padding: 12px 25px;
                  text-decoration: none;
                  border-radius: 4px;
                  margin-top: 20px;
                }
                .a {
                  color: white;
                  text-decoration: none;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>คณะเทคโนโลยีสารสนเทศและการสื่อสาร<br>มหาวิทยาลัยศิลปากร</h1>
                  <p>สำนักงานคณะเทคโนโลยีสารสนเทศและการสื่อสาร | โทร: 09-1765-9890</p>
                </div>
                <div class="content">
                  <p>สวัสดี,</p>
                  <p>การยืมอุปกรณ์ <strong>"${borrowInfo.equipment_name}"</strong> ของคุณได้รับการอนุมัติแล้ว.</p>
                  <p>รายละเอียดการยืม:</p>
                  <ul>
                    <li><strong>รหัสการยืม:</strong> ${borrowInfo.borrow_id}</li>
                    <li><strong>วันที่ยืม:</strong> ${new Date(borrowInfo.borrow_date).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })}</li>
                    <li><strong>วันที่คืน:</strong> ${new Date(borrowInfo.return_date).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })}</li>
                  </ul>
                  <p>ขอบคุณที่ใช้บริการของเรา!</p>
                  <a href="http://localhost:3000/" class="button">เยี่ยมชมเว็บไซต์ของเรา</a>
                </div>
                <div class="footer">
                  <p>หากคุณมีคำถามเพิ่มเติม โปรดติดต่อเราที่ <a href="mailto:support@yourwebsite.com">support@yourwebsite.com</a></p>
                </div>
              </div>
            </body>
          </html>
        `,
      };
      
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err.message);
          return res.status(500).json({ message: 'Error sending email', error: err.message });
        }

        console.log("Email sent successfully:", info.response);

        // ส่ง response กลับไปยัง client
        return res.status(200).json({
          message: 'Borrow request approved, equipment status updated, and email sent successfully',
          borrowDetails: borrowInfo,
        });
      });
    });
  });
});



// ฟังก์ชันสำหรับการปฏิเสธคำขอ (Reject)
app.put('/api/borrow/reject/:borrowId', (req, res) => {
  const borrowId = req.params.borrowId;
  const { reason } = req.body;  // รับเหตุผลจาก client

  if (!reason) {
    return res.status(400).json({ message: 'กรุณากรอกเหตุผลในการปฏิเสธคำขอ' });
  }

  const query = `
    UPDATE borrow b
    JOIN equipment e ON b.equipment_id = e.equipment_id
    SET b.status = 'ปฏิเสธ', e.status = 'พร้อมใช้งาน', b.reject_reason = ?
    WHERE b.borrow_id = ?;
  `;

  db.execute(query, [reason, borrowId], (err, result) => {
    if (err) {
      console.error('Error rejecting borrow request:', err);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการปฏิเสธคำขอ' });
    }

    const fetchBorrowDetails = `
      SELECT b.borrow_id, b.status, b.borrow_date, b.return_date, b.UserID, e.name as equipment_name, e.equipment_id, u.email as user_email, b.reject_reason
      FROM borrow b
      JOIN equipment e ON b.equipment_id = e.equipment_id
      JOIN users u ON b.UserID = u.UserID
      WHERE b.borrow_id = ?;
    `;

    db.query(fetchBorrowDetails, [borrowId], (err, borrowDetails) => {
      if (err) {
        console.error("Error fetching borrow details:", err.message);
        return res.status(500).json({ message: 'Error fetching borrow details', error: err.message });
      }

      if (borrowDetails.length === 0) {
        return res.status(404).json({ message: 'Borrow details not found' });
      }

      const borrowInfo = borrowDetails[0]; // ข้อมูลการยืมที่คิวรีมา
      const message = `การยืมอุปกรณ์ "${borrowInfo.equipment_name}" ถูกปฏิเสธ.`; // ข้อความแจ้งเตือน

      // ส่งข้อมูลผ่าน WebSocket
      io.emit('borrowRejected', {
        borrowDetails: borrowInfo,
        userId: borrowInfo.UserID,
        message: message
      });

      // ส่งอีเมลแจ้งเตือน
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nusev007x@gmail.com', // อีเมลที่ใช้ส่ง
          pass: 'wfal rddv aweq gnkg', // รหัสผ่านจาก App Password
        },
      });

      const mailOptions = {
        from: 'nusev007x@gmail.com',
        to: borrowInfo.user_email,   // อีเมลผู้รับ
        subject: 'การปฏิเสธการยืมอุปกรณ์',
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  background-color: #009498;
                  color: white;
                  padding: 15px 0;
                  border-radius: 8px 8px 0 0;
                }
                .header img {
                  width: 100px;
                  margin-bottom: 10px;
                }
                .content {
                  padding: 20px;
                  text-align: left;
                  color: #333;
                }
                .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777;
                  margin-top: 20px;
                }
                .button {
                  display: inline-block;
                  background-color: #009498;
                  color: white;
                  padding: 12px 25px;
                  text-decoration: none;
                  border-radius: 4px;
                  margin-top: 20px;
                }
                blockquote {
                  border-left: 5px solid #d9534f;
                  padding-left: 10px;
                  color: #d9534f;
                  font-style: italic;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>การปฏิเสธการยืมอุปกรณ์</h2>
                </div>
                <div class="content">
                  <p>เรียนผู้ใช้งาน,</p>
                  <p>คำขอยืมอุปกรณ์ <strong>${borrowInfo.equipment_name}</strong> ถูกปฏิเสธด้วยเหตุผลดังนี้:</p>
                  <blockquote>${reason}</blockquote>
                  <p>รายละเอียดการยืม:</p>
                  <ul>
                    <li><strong>รหัสการยืม:</strong> ${borrowInfo.borrow_id}</li>
                    <li><strong>วันที่ยืม:</strong> ${new Date(borrowInfo.borrow_date).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })}</li>
                    <li><strong>วันที่คืน:</strong> ${new Date(borrowInfo.return_date).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })}</li>
                  </ul>
                  <p>หากมีข้อสงสัยโปรดติดต่อฝ่ายสนับสนุน.</p>
                  <a href="http://localhost:3000/" class="button">เยี่ยมชมเว็บไซต์ของเรา</a>
                </div>
                <div class="footer">
                  <p>หากคุณมีคำถามเพิ่มเติม โปรดติดต่อเราที่ <a href="mailto:support@yourwebsite.com">support@yourwebsite.com</a></p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err.message);
          return res.status(500).json({ message: 'Error sending email', error: err.message });
        }

        console.log("Email sent successfully:", info.response);

        // ส่ง response กลับไปยัง client
        return res.status(200).json({
          message: 'คำขอถูกปฏิเสธและอีเมลแจ้งเตือนถูกส่งแล้ว',
          borrowDetails: borrowInfo,
        });
      });
    });
  });
});



// ฟังก์ชันสำหรับการลบคำขอ
app.put('/api/borrow/delete/:borrowId', (req, res) => {
  const borrowId = req.params.borrowId;
  const { deleteReason } = req.body;  // รับเหตุผลจาก client

  if (!deleteReason) {
    return res.status(400).json({ message: 'กรุณากรอกเหตุผลในการลบคำขอ' });
  }

  const query = `
    UPDATE borrow b
    JOIN equipment e ON b.equipment_id = e.equipment_id
    SET b.status = 'ข้อเสนอถูกลบ', e.status = 'พร้อมใช้งาน', b.reject_reason = ?
    WHERE b.borrow_id = ?;
  `;

  db.execute(query, [deleteReason, borrowId], (err, result) => {
    if (err) {
      console.error('Error deleting borrow request:', err);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบคำขอ' });
    }

    const fetchBorrowDetails = `
      SELECT b.borrow_id, b.status, b.borrow_date, b.return_date, b.UserID, e.name as equipment_name, e.equipment_id, u.email as user_email, b.reject_reason
      FROM borrow b
      JOIN equipment e ON b.equipment_id = e.equipment_id
      JOIN users u ON b.UserID = u.UserID
      WHERE b.borrow_id = ?;
    `;

    db.query(fetchBorrowDetails, [borrowId], (err, borrowDetails) => {
      if (err) {
        console.error("Error fetching borrow details:", err.message);
        return res.status(500).json({ message: 'Error fetching borrow details', error: err.message });
      }

      if (borrowDetails.length === 0) {
        return res.status(404).json({ message: 'Borrow details not found' });
      }

      const borrowInfo = borrowDetails[0]; // ข้อมูลการยืมที่คิวรีมา
      const message = `การยืมอุปกรณ์ "${borrowInfo.equipment_name}" ข้อเสนอถูกลบ.`;

      // ส่งข้อมูลผ่าน WebSocket
      io.emit('borrowDeleted', {
        borrowDetails: borrowInfo,
        userId: borrowInfo.UserID,
        message: message
      });

      // ส่งอีเมลแจ้งเตือน
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nusev007x@gmail.com', // อีเมลที่ใช้ส่ง
          pass: 'wfal rddv aweq gnkg', // รหัสผ่านจาก App Password
        },
      });

      const mailOptions = {
        from: 'nusev007x@gmail.com',
        to: borrowInfo.user_email,   // อีเมลผู้รับ
        subject: 'ข้อเสนอถูกลบคำขอ',
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  background-color: #009498;
                  color: white;
                  padding: 15px 0;
                  border-radius: 8px 8px 0 0;
                }
                .header img {
                  width: 100px;
                  margin-bottom: 10px;
                }
                .content {
                  padding: 20px;
                  text-align: left;
                  color: #333;
                }
                .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777;
                  margin-top: 20px;
                }
                .button {
                  display: inline-block;
                  background-color: #009498;
                  color: white;
                  padding: 12px 25px;
                  text-decoration: none;
                  border-radius: 4px;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>ข้อเสนอถูกลบคำขอ</h2>
                </div>
                <div class="content">
                  <p>สวัสดี,</p>
                  <p>การยืมอุปกรณ์ <strong>"${borrowInfo.equipment_name}"</strong> ข้อเสนอถูกลบคำขอ.</p>
                  <p>รายละเอียดการยืม:</p>
                  <ul>
                    <li><strong>รหัสการยืม:</strong> ${borrowInfo.borrow_id}</li>
                    <li><strong>วันที่ยืม:</strong> ${new Date(borrowInfo.borrow_date).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })}</li>
                    <li><strong>วันที่คืน:</strong> ${new Date(borrowInfo.return_date).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })}</li>
                  </ul>
                  <p>ขอบคุณที่ใช้บริการของเรา!</p>
                  <a href="http://localhost:3000/" class="button">เยี่ยมชมเว็บไซต์ของเรา</a>
                </div>
                <div class="footer">
                  <p>หากคุณมีคำถามเพิ่มเติม โปรดติดต่อเราที่ <a href="mailto:support@yourwebsite.com">support@yourwebsite.com</a></p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err.message);
          return res.status(500).json({ message: 'Error sending email', error: err.message });
        }

        console.log("Email sent successfully:", info.response);

        // ส่ง response กลับไปยัง client
        return res.status(200).json({
          message: 'คำขอถูกลบและสถานะอุปกรณ์ถูกตั้งเป็น "พร้อมใช้งาน"',
          borrowDetails: borrowInfo,
        });
      });
    });
  });
});





app.get('/admin/showtypeid', (req, res) => {
  const sqlQuery = 'SELECT * FROM serialnumber'; // ดึงข้อมูลทั้งหมดจาก serialnumber
  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
      return res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลได้' });
    }
    res.status(200).json(results);
  });
});

//UPDATE Type_id

app.put('/admin/updatetypeid', (req, res) => {
  const { oldTypeId, newTypeId, typeSerial } = req.body;  // รับ typeSerial จาก client

  // สร้างคำสั่ง SQL เพื่ออัปเดตทั้งในตาราง serialnumber และ equipment
  const sqlUpdateSerialnumber = 'UPDATE serialnumber SET type_id = ?, type_serial = ? WHERE type_id = ?';
  const sqlUpdateEquipment = 'UPDATE equipment SET type_id = ? WHERE type_id = ?';

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเริ่มต้นการทำธุรกรรม' });
    }

    // อัปเดตตาราง serialnumber
    db.query(sqlUpdateSerialnumber, [newTypeId, typeSerial, oldTypeId], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดต serialnumber' });
        });
      }

      // อัปเดตตาราง equipment
      db.query(sqlUpdateEquipment, [newTypeId, oldTypeId], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดต equipment' });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: 'เกิดข้อผิดพลาดในการ commit การทำธุรกรรม' });
            });
          }

          res.status(200).json({ message: 'อัปเดต type_id สำเร็จ' });
        });
      });
    });
  });
});


//Delete Type_id
app.delete('/admin/deletetypeid/:typeId', (req, res) => {
  const { typeId } = req.params;  // Extract typeId from request parameters

  // SQL query to delete the type_id from serialnumber table
  const query = 'DELETE FROM serialnumber WHERE type_id = ?';

  // Execute the query
  db.query(query, [typeId], (err, result) => {
    if (err) {
      console.error('Error deleting type ID:', err);
      return res.status(500).json({ message: 'Error deleting type ID' });
    }

    // If no rows were affected, the type_id was not found
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Type ID not found' });
    }

    // If deletion was successful
    res.status(200).json({ message: 'Type ID deleted successfully' });
  });
});

// สถิติการยืมรายวัน
app.get('/api/borrow/daily-stats', (req, res) => {
  const query = `
    SELECT 
      DATE(borrow_date) AS date, 
      COUNT(*) AS total 
    FROM borrow 
    GROUP BY DATE(borrow_date)
    ORDER BY DATE(borrow_date);
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching daily borrow stats:', err);
      return res.status(500).json({ message: 'Error fetching daily borrow stats' });
    }

    // ส่งข้อมูลในรูปแบบ JSON
    res.status(200).json(results);
  });
});


//กำหนดการคืน
app.get('/api/borrow/schedule', (req, res) => {
  const query = `
    SELECT 
      b.borrow_id, 
      b.UserID AS user_id, 
      e.name AS equipment_name, 
      b.return_date,
      u.phone_number
    FROM borrow b
    JOIN equipment e ON b.equipment_id = e.equipment_id
    JOIN users u ON b.UserID = u.UserID
    WHERE b.status = 'อนุมัติ'
    ORDER BY b.return_date ASC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching return schedule:', err);
      return res.status(500).json({ message: 'Error fetching return schedule' });
    }

    const today = new Date();
    const formattedResults = results.map((row) => {
      const returnDate = new Date(row.return_date);
      const daysLeft = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24)); // คำนวณจำนวนวันที่เหลือ
      return {
        ...row,
        days_left: daysLeft >= 0 ? daysLeft : 0, // ถ้าครบกำหนดแล้วให้แสดง 0
      };
    });

    res.status(200).json(formattedResults);
  });
});

//Mark as Returned
app.put('/api/borrow/mark-returned/:borrowId', (req, res) => {
  const { borrowId } = req.params;
  const query = `UPDATE borrow SET status = 'คืนแล้ว' WHERE borrow_id = ?`;

  db.query(query, [borrowId], (err, result) => {
    if (err) {
      console.error('Error updating status:', err);
      return res.status(500).send('Error updating status');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Borrow request not found');
    }

    res.status(200).json({ message: 'Status updated to "คืนแล้ว"' });
  });
});


//Save Remark
app.put('/api/borrow/save-remark/:borrowId', (req, res) => {
  const { borrowId } = req.params;
  const { remark } = req.body;
  const query = `UPDATE borrow SET remark = ? WHERE borrow_id = ?`;
  db.query(query, [remark, borrowId], (err, result) => {
    if (err) return res.status(500).send('Error saving remark');
    res.send('Remark saved successfully');
  });
});

//ลบสถานะการยืม
app.delete('/api/borrow/:borrowId', (req, res) => {
  const { borrowId } = req.params;

  const query = 'DELETE FROM borrow WHERE borrow_id = ?';

  db.query(query, [borrowId], (err, result) => {
    if (err) {
      console.error('Error deleting record:', err);
      return res.status(500).json({ message: 'Error deleting record' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json({ message: 'Record deleted successfully' });
  });
});
//ประวัติการยืม
app.get('/api/user-borrow-history/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      b.borrow_id,
      b.borrow_date,
      b.return_date,
      b.status,
      e.name AS equipment_name
    FROM borrow b
    JOIN equipment e ON b.equipment_id = e.equipment_id
    WHERE b.UserID = ?
    ORDER BY b.borrow_date DESC;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user borrow history:', err);
      return res.status(500).json({ message: 'Error fetching user borrow history' });
    }

    res.status(200).json(results);
  });
});

// ดึงข้อมูลผู้ใช้งานทั้งหมด
app.get('/api/manage-users', (req, res) => {
  const query = 'SELECT UserID, firstname, lastname, email, phone_number, role FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching user data:', err);
      return res.status(500).json({ message: 'Error fetching user data' });
    }
    res.status(200).json(results);
  });
});

//แก้ไข role
app.put('/users/role/:id', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const query = 'UPDATE users SET role = ? WHERE UserID = ?';

  db.query(query, [role, id], (err, result) => {
    if (err) {
      console.error('Error updating role:', err);
      return res.status(500).json({ message: 'Error updating role' });
    }

    res.status(200).json({ message: 'Role updated successfully' });
  });
});

//ผู้ใช้งาน
app.delete('/api/users/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    DELETE FROM users 
    WHERE UserID = ?;
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Error deleting user' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  });
});

//addnewuser
app.post('/api/users/add', async (req, res) => {
  const { firstname, lastname, email, phone_number, role, password } = req.body;

  // ตรวจสอบว่ามีการกรอกข้อมูลครบถ้วน
  if (!firstname || !lastname || !email || !phone_number || !role || !password) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    // แฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // เพิ่มผู้ใช้งานใหม่ในฐานข้อมูล
    const query = `
      INSERT INTO users (firstname, lastname, email, phone_number, role, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [firstname, lastname, email, phone_number, role, hashedPassword],
      (err, result) => {
        if (err) {
          console.error('Error adding user:', err);
          return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน' });
        }
        res.status(201).json({ message: 'เพิ่มผู้ใช้งานสำเร็จ!' });
      }
    );
  } catch (err) {
    console.error('Error hashing password:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแฮชรหัสผ่าน' });
  }
});

// บล็อคหรือปลดบล็อคผู้ใช้งาน
app.put('/api/users/block/:userId', (req, res) => {
  const { userId } = req.params;
  const { isBlocked } = req.body;

  // ตรวจสอบว่าค่าที่ส่งมาถูกต้อง
  if (typeof isBlocked === 'undefined') {
    return res.status(400).json({ message: 'Missing isBlocked value' });
  }

  const query = 'UPDATE users SET isBlocked = ? WHERE UserID = ?';

  db.query(query, [isBlocked, userId], (err, result) => {
    if (err) {
      console.error('Error updating block status:', err);
      return res.status(500).json({ message: 'Error updating block status' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const statusMessage = isBlocked ? 'blocked' : 'unblocked';
    res.status(200).json({ message: `User successfully ${statusMessage}` });
  });
});


// เริ่มเซิร์ฟเวอร์
app.listen(3333, () => {
  console.log("Server running on http://localhost:3333");
});