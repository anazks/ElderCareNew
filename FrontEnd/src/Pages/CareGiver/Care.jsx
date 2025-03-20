import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CareGiverRegister.css';

function CareGiverRegister() {
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    place: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/admin/addCareGiver', formData);
      console.log(response,"resposne from care reg")
      alert('Caregiver registered successfully!');
      navigate('/CareGiverLogin');
    } catch (error) {
      console.error('Error registering caregiver:', error);
      alert('Error registering caregiver. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Caregiver Registration</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          Name:
          <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Place:
          <input type="text" name="place" value={formData.place} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <button type="submit" className="submit-btn" >Register</button>
        <a href="http://localhost:3000/CareGiverLogin">Login Now</a>
      </form>
    </div>
  );
}

export default CareGiverRegister;
