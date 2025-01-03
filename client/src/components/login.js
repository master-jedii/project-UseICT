import React from 'react';
import Button from '@mui/material/Button';

const Login = () => {
    return (
      <div className="container">
          <div className="image-section"></div>
          <div className="form-section">
              <div className="logo">
                  <img src="https://via.placeholder.com/100" alt="SU KITS Logo" /> {/* Replace with your logo URL */}
              </div>
              <div className="login-box">
                  <h1>LOGIN</h1>
                  <p>Welcome to SU KITS<br />จัดการยืมคืนอุปกรณ์การศึกษาพร้อมสนับสนุนการเรียนรู้<br />กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน</p>
                  <form action="#" method="post">
                      <input type="email" name="email" placeholder="Email" required />
                      <input type="password" name="password" placeholder="Password" required />
                      <Button variant="contained" color="primary" type="submit">
                          LOGIN
                      </Button>
                  </form>
                  <div className="links">
                      <p>New Users? <a href="#">Signup</a></p>
                      <p><a href="#">Forgot your password?</a></p>
                  </div>
              </div>
          </div>
      </div>
    );
}

export default Login;
