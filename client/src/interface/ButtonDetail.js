import React, { useState } from 'react';
import '../interface/CSS/ButtonDetail.css';

const ButtonDetail = ({ defectId }) => {
  const [defectDetails, setDefectDetails] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // ฟังก์ชันในการดึงข้อมูล defect จาก API
  const fetchDefectDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3333/api/defect-reports/${defectId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Defect Data:', data);

      setDefectDetails(data.length > 0 ? data[0] : null);
      setHistoryData(data);
      setIsHistoryModalOpen(true);
    } catch (error) {
      console.error('Error fetching defect details:', error);
    }
  };

  const handleClick = () => {
    fetchDefectDetails();
  };

  const closeModal = () => {
    setIsHistoryModalOpen(false);
  };

  return (
    <div>
      <button onClick={handleClick} className="detail-btn">รายละเอียด</button>
      {isHistoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className='modal-detail-header'>รายละเอียดอุปกรณ์  </h2>

            {/* ฟอร์มแสดงรายละเอียด */}
            <form className="defect-form">

              <label></label>
              <table className="defect-table">
                <thead>
                  <tr>
                    <th>วันที่บันทึก</th>
                    <th>รายละเอียดตำหนิ</th>
                    <th>รูปภาพ</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((report) => (
                    <tr key={report.report_id}>
                      <td>{new Date(report.created_at).toLocaleDateString('th-TH')}</td>
                      <td>{report.defect_details}</td>
                      <td>
                        {report.image_paths ? (
                          (() => {
                            try {
                              // ตรวจสอบว่า image_paths เป็น string ที่มี JSON array หรือไม่
                              const imageArray = Array.isArray(report.image_paths)
                                ? report.image_paths // ถ้าเป็น array แล้ว ใช้ได้เลย
                                : JSON.parse(report.image_paths); // ถ้าเป็น string ให้แปลงเป็น array

                              const imagePath = imageArray.length > 0 ? imageArray[0] : null; // ดึงค่ารูปแรก

                              return imagePath ? (
                                <img
                                  src={`http://localhost:3333/${imagePath}`}
                                  alt="ตำหนิอุปกรณ์"
                                  className="defect-img"
                                />
                              ) : (
                                "ไม่มีภาพ"
                              );
                            } catch (error) {
                              console.error("Error parsing image_paths:", error);
                              return "เกิดข้อผิดพลาดในการโหลดภาพ";
                            }
                          })()
                        ) : (
                          "ไม่มีภาพ"
                        )}
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
             



              <button type="button" onClick={closeModal} className="close-btn-detail">ปิด</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonDetail;
