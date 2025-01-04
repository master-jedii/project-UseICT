import React, { useState } from 'react';
import Axios from 'axios';
import "../CSS/FormAddEquiment.css";

const FormAddEquiment = () => {
    const [name, Setname] = useState("");
    const [description, Setdescription] = useState("");
    const [category, Setcategory] = useState("");

    const addEquipment = () => {
        Axios.post("http://localhost:3333/create", {
            name: name,
            description: description,
            category: category,
        }).then(() => {
            setEquipment([
                ...equipment,
                {
                    name: name,
                    description: description,
                    category: category,
                },
            ]);
        });
    };

    const [equipment, setEquipment] = useState([]);

    const getEquipment = () => {
        Axios.get('http://localhost:3333/admin').then((response) => {
            setEquipment(response.data);
        });
    };

    return (
        <div className="App container">
            <h1>Form Add Equipment</h1>
            <div className="information">
                <form>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">
                            ชื่ออุปกรณ์:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Enter equipment name"
                            onChange={(event) => {
                                Setname(event.target.value);
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="description">
                            รายละเอียด:
                        </label>
                        <input
                            className="form-control"
                            name="description"
                            placeholder="Enter equipment description"
                            onChange={(event) => {
                                Setdescription(event.target.value);
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="category">
                            หมวดหมู่:
                        </label>
                        <select
                            className="form-control"
                            name="category"
                            value={category}
                            onChange={(event) => {
                                Setcategory(event.target.value);
                            }}
                        >
                            <option value="" disabled>เลือกหมวดหมู่</option>
                            <option value="กล้อง">กล้อง</option>
                            <option value="ขาตั้งกล้อง">ขาตั้งกล้อง</option>
                            <option value="ไฟสำหรับถ่ายทำ">ไฟสำหรับถ่ายทำ</option>
                            <option value="อุปกรณ์ด้านเสียง">อุปกรณ์ด้านเสียง</option>
                            <option value="อุปกรณ์จัดแสง">อุปกรณ์จัดแสง</option>
                            <option value="อุปกรณ์อื่นๆ">อุปกรณ์อื่นๆ</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success" onClick={addEquipment}>
                        Add Equipment
                    </button>
                </form>
            </div>
            <hr />
            <div className="employees">
                <button className="btn btn-primary" onClick={getEquipment}>
                    Show Equipment
                </button>
                <br /><br />
                {equipment.map((val, key) => {
                    return (
                        <div className="equipment card" key={key}>
                            <div className="card-body text-left">
                                <p className="card-text">Equipment ID: {val.equipment_id}</p>
                                <p className="card-text">Equipment Name: {val.name}</p>
                                <p className="card-text">Description: {val.description}</p>
                                <p className="card-text">Category: {val.category}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FormAddEquiment;