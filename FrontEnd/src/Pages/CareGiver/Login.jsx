import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CareGiverLogin.css';

function CareGiverLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/admin/Carelogin', formData);
      alert('Login successful!');
      console.log(response.data);
      
      // Navigate to CareHome on successful login
      navigate('/CareHome');
      
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2>Caregiver Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <button type="submit" className="login-btn">Login</button>
      </form>
      <a href="/CareGiver">Register Now</a>
    </div>
  );
}

export default CareGiverLogin;
