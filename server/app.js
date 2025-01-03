const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

// การเชื่อมต่อฐานข้อมูล
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // รหัสผ่าน MySQL ของคุณ
    database: 'project-useict'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// ตัวอย่าง API POST สำหรับ Equipment
app.post('/equipment', (req, res) => {
    const { Type_Equipment, Name_Equipment, Status_Equipment, Details_Equipment } = req.body;
    const query = `INSERT INTO Equipment (Type_Equipment, Name_Equipment, Status_Equipment, Details_Equipment) VALUES (?, ?, ?, ?)`;
    connection.execute(query, [Type_Equipment, Name_Equipment, Status_Equipment, Details_Equipment], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Equipment added successfully' });
    });
});

// เริ่มเซิร์ฟเวอร์
const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
