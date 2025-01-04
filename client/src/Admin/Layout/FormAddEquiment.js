import React, { useState } from 'react';
import Axios from 'axios';
import "../CSS/FormAddEquiment.css"


const FormAddEquiment = () => {


    const [Equipmentname, SetEquipmentname] = useState("");
    const [description, Setdescription] = useState("");
    const [Category, SetCategory] = useState("");

    const addEquipment = () => {
        Axios.post("http://localhost:3333/create", {
            Equipmentname: Equipmentname,
            description: description,
            Category: Category,

        }).then(() => {
            setEquipment([
                ...equipment,
                {
                    Equipmentname: Equipmentname,
                    description: description,
                    Category: Category,
                },
            ]);
        });
    };





    const [equipment, setEquipment] = useState([]);

    const getEquipment = () => {
        Axios.get('http://localhost:3333/admin').then((response) => {
            setEquipment(response.data);
        })
    }




    return (
        <div className="App container">
            <h1>Form Add Equipment</h1>
            <div className="information">
                <form >
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
                                SetEquipmentname(event.target.value)
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="description">
                            รายละเอียด:
                        </label>
                        <textarea
                            className="form-control"
                            name="description"
                            placeholder="Enter equipment description"
                            onChange={(event) => {
                                Setdescription(event.target.value)
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="category">
                            หมวดหมู่:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="category"
                            placeholder="Enter equipment category"
                            onChange={(event) => {
                                SetCategory(event.target.value)
                            }}
                        />
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
                <br></br><br></br>
                {equipment.map((val, key) => {
                    return (
                        <div className='equipment card'>
                            <div className='card-body text-left'>
                                <p className='card-text'>Equipment ID::{val.equipment_id}</p>
                                <p className='card-text'>Equipment ID::{val.name}</p>
                                <p className='card-text'>Equipment Name:{val.description}</p>
                                <p className='card-text'>Category:{val.category}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default FormAddEquiment;
