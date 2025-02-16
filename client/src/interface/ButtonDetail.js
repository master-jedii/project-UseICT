import React, { useState } from 'react';
import Modal from 'react-modal';

const ButtonDetail = ({ defectId }) => {
  const [defectDetails, setDefectDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ฟังก์ชันในการดึงข้อมูล defect จาก API
  const fetchDefectDetails = async () => {
    try {
      const response = await fetch(`/api/defect-reports/${defectId}`);
      const data = await response.json();
      setDefectDetails(data.length > 0 ? data[0] : null); // รับข้อมูล defect ตัวแรก
      setIsModalOpen(true); // เปิด modal เมื่อดึงข้อมูลเสร็จ
    } catch (error) {
      console.error('Error fetching defect details:', error);
    }
  };

  // เมื่อกดปุ่มให้เรียกใช้ฟังก์ชัน fetchDefectDetails
  const handleClick = () => {
    fetchDefectDetails();
  };

  // ฟังก์ชันในการปิด modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={handleClick}>รายละเอียด</button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Defect Details">
        <h3>รายละเอียด defect</h3>

        {defectDetails ? (
          <div>
            <p><strong>อุปกรณ์ (ID):</strong> {defectDetails.equipment_id}</p>
            <p><strong>รายละเอียด:</strong> {defectDetails.defect_details || 'ไม่มีตำหนิ'}</p>
            <p><strong>วันที่สร้า:</strong> {new Date(defectDetails.created_at).toLocaleString()}</p>
            <div>
              <h4>รูปภาพ:</h4>
              {defectDetails.image_paths.length > 0 ? (
                defectDetails.image_paths.map((image, index) => (
                  <img key={index} src={image} alt={`Defect image ${index + 1}`} style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
                ))
              ) : (
                <p>ไม่มีรูปภาพ</p>
              )}
            </div>
            <button onClick={closeModal}>ปิด</button>
          </div>
        ) : (
          <p>กำลังโหลดข้อมูล...</p>
        )}
      </Modal>
    </div>
  );
};

export default ButtonDetail;
