import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Signup = () => {
    const [formData, setFormData] = useState({
        UserID: '',
        firstname: '',
        lastname: '',
        grade: '',
        branch: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone_number: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // ตรวจสอบว่ากรอกข้อมูลครบทุกช่อง
        if (
            !formData.UserID ||
            !formData.firstname ||
            !formData.lastname ||
            !formData.grade ||
            !formData.branch ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.phone_number
        ) {
            Swal.fire('Error', 'กรุณากรอกข้อมูลให้ครบทุกช่อง', 'error');
            return;
        }

        // ตรวจสอบ password และ confirmPassword
        if (formData.password !== formData.confirmPassword) {
            Swal.fire('Error', 'Passwords do not match', 'error');
            return;
        }

        try {
            // ตรวจสอบ UserID และ email ซ้ำ
            const checkResponse = await axios.post('http://localhost:3333/check-duplicate', {
                UserID: formData.UserID,
                email: formData.email,
            });

            if (checkResponse.data.exists) {
                Swal.fire('Error', checkResponse.data.message || 'UserID หรือ Email ซ้ำในระบบ', 'error');
                return;
            }

            // ส่งข้อมูล signup ไปยังเซิร์ฟเวอร์
            const { confirmPassword, ...userData } = formData;
            const response = await axios.post('http://localhost:3333/register', userData);

            if (response.status === 200) {
                Swal.fire('Success', 'Signup successful! You will be redirected to login.', 'success').then(() => {
                    window.location.href = '/login';
                });
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'เกิดข้อผิดพลาด', 'error');
        }
    };

    return (
        <div className="signup-container">
    <h1>Signup</h1>
    <form onSubmit={handleSignup}>
        {/* UserID */}
        <input
            type="number"
            name="UserID"
            placeholder="UserID"
            value={formData.UserID}
            onChange={(e) => {
                if (e.target.value.length <= 10) handleChange(e); // จำกัดความยาวไม่เกิน 10
            }}
            required
        />
        
        {/* Firstname */}
        <input
            type="text"
            name="firstname"
            placeholder="Firstname"
            value={formData.firstname}
            onChange={(e) => {
                if (e.target.value.length <= 50) handleChange(e); // จำกัดความยาวไม่เกิน 50
            }}
            required
        />

        {/* Lastname */}
        <input
            type="text"
            name="lastname"
            placeholder="Lastname"
            value={formData.lastname}
            onChange={(e) => {
                if (e.target.value.length <= 50) handleChange(e); // จำกัดความยาวไม่เกิน 50
            }}
            required
        />

        {/* Grade */}
        <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
        >
            <option value="">Select Grade</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
        </select>

        {/* Branch */}
        <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
        >
            <option value="">Select Branch</option>
            <option value="การจัดการ">การจัดการ</option>
            <option value="ICT">ICT</option>
            <option value="นิเทศ">นิเทศ</option>
        </select>

        {/* Email */}
        <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => {
                if (e.target.value.length <= 50) handleChange(e); // จำกัดความยาวไม่เกิน 50
            }}
            required
        />

        {/* Password */}
        <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
        />

        {/* Confirm Password */}
        <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
        />

        {/* Phone Number */}
        <input
            type="number"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={(e) => {
                if (e.target.value.length <= 10) handleChange(e); // จำกัดความยาวไม่เกิน 10
            }}
            required
        />

        <button type="submit">Signup</button>
    </form>
</div>

    );
};

export default Signup;