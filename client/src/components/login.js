import React from 'react';

const Login = () => {
  return (
    <div>
      <h1>เข้าสู่ระบบ</h1>
      <form>
        <input type="text" placeholder="ชื่อผู้ใช้" />
        <input type="password" placeholder="รหัสผ่าน" />
        <button>เข้าสู่ระบบ</button>
      </form>
    </div>
  );
};

export default Login;
