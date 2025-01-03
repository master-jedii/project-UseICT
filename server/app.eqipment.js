app.post('/equipment', jsonParser, (req, res) => {
    const { Type_Equipment, Name_Equipment, Status_Equipment, Details_Equipment, Image_URL } = req.body;

    if (!Type_Equipment || !Name_Equipment || !Status_Equipment) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO Equipment (Type_Equipment, Name_Equipment, Status_Equipment, Details_Equipment, Image_URL) 
        VALUES (?, ?, ?, ?, ?)
    `;
    connection.execute(
        query,
        [Type_Equipment, Name_Equipment, Status_Equipment, Details_Equipment, Image_URL],
        (err, results) => {
            if (err) {
                console.error('Error adding equipment:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({
                message: 'Equipment added successfully',
                data: { Equipment_ID: results.insertId, Type_Equipment, Name_Equipment, Status_Equipment, Details_Equipment, Image_URL }
            });
        }
    );
});
