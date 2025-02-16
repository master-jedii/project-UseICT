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
            <h2>ประวัติตำหนิอุปกรณ์</h2>

            {/* ฟอร์มแสดงรายละเอียด */}
            <form className="defect-form">
              <label>ชื่ออุปกรณ์</label>
              <h1>
                type="text"
                name="defect_details"
                value={defectDetails?.defect_details || ''}
                readOnly
                className="form-input"
              </h1>

              <label>รูปภาพ:</label>
              {defectDetails?.image_paths ? (
                (() => {
                  try {
                    const imageArray = Array.isArray(defectDetails.image_paths)
                      ? defectDetails.image_paths
                      : JSON.parse(defectDetails.image_paths);

                    return imageArray.length > 0 ? (
                      imageArray.map((imagePath, index) => (
                        <img
                          key={index}
                          src={`http://localhost:3333/${imagePath}`}
                          alt={`Defect Image ${index + 1}`}
                          className="defect-img"
                        />
                      ))
                    ) : (
                      <p>ไม่มีภาพ</p>
                    );
                  } catch (error) {
                    console.error('Error parsing image_paths:', error);
                    return <p>เกิดข้อผิดพลาดในการโหลดภาพ</p>;
                  }
                })()
              ) : (
                <p>ไม่มีภาพ</p>
              )}

              <button type="button" onClick={closeModal} className="close-btn">ปิด</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonDetail;
