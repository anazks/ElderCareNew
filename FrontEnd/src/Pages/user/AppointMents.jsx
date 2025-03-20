import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './appointments.css';

function AppointMents() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/appointments/viewAppoinment');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      {appointments.length > 0 ? (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Address</th>
              <th>Disease</th>
              <th>Department</th>
              <th>Time</th>
              <th>Date</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.patientName}</td>
                <td>{appointment.mobile}</td>
                <td>{appointment.email}</td>
                <td>{appointment.address}</td>
                <td>{appointment.disease}</td>
                <td>{appointment.department}</td>
                <td>{appointment.time}</td>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.age}</td>
                <td>{appointment.gender}</td>
                <td>${appointment.payment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
}

export default AppointMents;
