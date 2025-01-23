import React, { useState, useEffect } from 'react';
import NavbarAdmin from './NavbarAdmin';
import Axios from 'axios';
import '../CSS/ManageUser.css';
import Swal from 'sweetalert2';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone_number: '',
    role: 'user',
    password: '', // เพิ่มฟิลด์ password
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchName, searchEmail]);

  const fetchAllUsers = () => {
    Axios.get('http://localhost:3333/api/manage-users')
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('ไม่สามารถโหลดข้อมูลผู้ใช้งานได้');
        setLoading(false);
      });
  };

  const handleSearch = () => {
    let filtered = users;

    if (searchName) {
      filtered = filtered.filter((user) =>
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchEmail) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const resetFilters = () => {
    setSearchName('');
    setSearchEmail('');
    setFilteredUsers(users);
  };

  const deleteUser = (userId) => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบผู้ใช้นี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3333/api/users/${userId}`)
          .then(() => {
            Swal.fire('ลบสำเร็จ!', 'ผู้ใช้งานถูกลบเรียบร้อยแล้ว', 'success');
            fetchAllUsers();
          })
          .catch(() => {
            Swal.fire('ล้มเหลว!', 'ไม่สามารถลบผู้ใช้งานได้', 'error');
          });
      }
    });
  };

  const editRole = (userId, currentRole) => {
    Swal.fire({
      title: '<h2 style="color:#00796b; font-size: 25px; font-weight: bold; margin-bottom: 15px;">แก้ไขบทบาทผู้ใช้งาน</h2>',
      html: `
        <div style="
          text-align: left; 
          font-size: 16px; 
          line-height: 1.6; 
          margin-bottom: 15px;
        ">
          <label for="role-select" style="
            font-weight: bold; 
            color: #555; 
            font-size: 14px; 
            display: block; 
            margin-bottom: 5px;
          ">
            เลือกบทบาท:
          </label>
          <select id="role-select" class="swal2-select" style="
            width: 100%; 
            max-width: 350px; 
            padding: 10px; 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            font-size: 16px;
          ">
            <option value="admin" ${currentRole === 'admin' ? 'selected' : ''}>Admin</option>
            <option value="user" ${currentRole === 'user' ? 'selected' : ''}>User</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        popup: 'custom-popup',
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
      },
      preConfirm: () => {
        const selectedRole = document.getElementById('role-select').value;
        if (!selectedRole) {
          Swal.showValidationMessage('กรุณาเลือกบทบาท');
        }
        return selectedRole;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newRole = result.value;
        Axios.put(`http://localhost:3333/users/role/${userId}`, { role: newRole })
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ!',
              text: 'บทบาทผู้ใช้งานถูกเปลี่ยนแปลงเรียบร้อยแล้ว',
              timer: 1500,
              showConfirmButton: false,
            });
            fetchAllUsers();
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว!',
              text: 'ไม่สามารถแก้ไขบทบาทผู้ใช้งานได้',
            });
          });
      }
    });
  };

  const handleAddUser = () => {
    if (newUser.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'รหัสผ่านสั้นเกินไป',
        text: 'กรุณาตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร',
      });
      return;
    }

    Axios.post('http://localhost:3333/api/users/add', newUser)
      .then(() => {
        Swal.fire('สำเร็จ!', 'ผู้ใช้งานถูกเพิ่มเรียบร้อยแล้ว', 'success');
        setNewUser({
          firstname: '',
          lastname: '',
          email: '',
          phone_number: '',
          role: 'user',
          password: '', // รีเซ็ตรหัสผ่าน
        });
        setIsModalOpen(false);
        fetchAllUsers();
      })
      .catch(() => {
        Swal.fire('ล้มเหลว!', 'ไม่สามารถเพิ่มผู้ใช้งานได้', 'error');
      });
  };

  return (
    <div>
      <div className="admin-dashboard">
        <NavbarAdmin />
        <div className="admin-dashboard-typeid">
          <header className="admin-header-info-typeid">
            <div className="admin-header-info">
              <h1>จัดการผู้ใช้งาน</h1>
            </div>
          </header>
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="ค้นหาชื่อผู้ใช้งาน"
            />
            <input
              className="search-input"
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="ค้นหาอีเมล"
            />
            <button className="reset-button" onClick={resetFilters}>
              เคลียร์
            </button>
          </div>
          <button
            className="add-user-btn"
            onClick={() => setIsModalOpen(true)}
          >
            เพิ่มผู้ใช้งานใหม่
          </button>

          {loading && <div>กำลังโหลดข้อมูล...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}

          {!loading && !error && (
            <table className="user-table">
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>ชื่อ</th>
                  <th>อีเมล</th>
                  <th>บทบาท</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.UserID}>
                    <td>{index + 1}</td>
                    <td>
                      {user.firstname} {user.lastname}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => editRole(user.UserID, user.role)}
                      >
                        แก้ไขบทบาท
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteUser(user.UserID)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h2>เพิ่มผู้ใช้งานใหม่</h2>
                <form>
                  <label>ชื่อ:</label>
                  <input
                    type="text"
                    name="firstname"
                    value={newUser.firstname}
                    onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
                  />
                  <label>นามสกุล:</label>
                  <input
                    type="text"
                    name="lastname"
                    value={newUser.lastname}
                    onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
                  />
                  <label>อีเมล:</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                  <label>เบอร์โทร:</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={newUser.phone_number}
                    onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
                  />
                  <label>รหัสผ่าน:</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <label>บทบาท:</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="modal-actions-manager">
                    <button type="button" onClick={handleAddUser}>
                      บันทึก
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)} style={{backgroundColor : "#dc3545"}}>
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
