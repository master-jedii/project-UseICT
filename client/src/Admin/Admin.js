import React from 'react';
import Dashboard from './Layout/Dashboard';  // สมมติว่า Dashboard เป็นส่วนหนึ่งของหน้า Admin

const Admin = () => {
  return (
    <div>
      <Dashboard /> {/* ส่วนที่แสดงในหน้า Admin */}
    </div>
  );
};

export default Admin;
