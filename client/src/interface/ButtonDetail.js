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
              <h2 className='modal-detail'>รูปภาพ : </h2>
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
              <h2 className='modal-detail'>การใช้งาน : </h2>
              <h3 className='info-detail'>{defectDetails?.defect_details || 'ไม่มีข้อมูล'}</h3>



              <button type="button" onClick={closeModal} className="close-btn-detail">ปิด</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonDetail;
