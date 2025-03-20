import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaClipboardList, FaUserMd, FaPills, FaBell, FaCalendarCheck } from 'react-icons/fa';
import './CaregiverDashboard.css';
import BlogAdd from '../user/BlogAdd';
import AddSocialEvents from '../user/AddSocialEvents';
import AppointMents from '../user/AppointMents';

function CareGiverDashboard() {
  const [patients, setPatients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState('patients');
  
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ 
    patientId: '', 
    description: '', 
    dueDate: '', 
    priority: 'medium' 
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch patients
        const patientsResponse = await axios.get('http://localhost:5000/nurses');
        setPatients(patientsResponse.data);
  
        // Fetch tasks and map to the new structure
        const tasksResponse = await axios.get('http://localhost:5000/nurses/getFullTask');
        console.log(tasksResponse,"tasksResponse")
        const formattedTasks = tasksResponse.data.tasks.map(task => ({
          id: task._id,
          patientName: task.name,
          description: task.notes,
          dueDate: task.time,
          email :task.email,
          status: task.helpNeeded ? 'pending' : 'completed',
          priority: task.priority === 'normal' ? 'medium' : task.priority
        }));
        console.log(formattedTasks,"--------")
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const handleAddTask = (e) => {
    e.preventDefault();
    const patient = patients.find(p => p._id === newTask.patientId);
    const patientName = patient ? patient.patientName : 'Unknown Patient';
    
    const task = {
      id: tasks.length + 1,
      patientName,
      description: newTask.description,
      dueDate: newTask.dueDate,
      status: 'pending',
      priority: newTask.priority
    };
    
    setTasks([...tasks, task]);
    setNewTask({ patientId: '', description: '', dueDate: '', priority: 'medium' });
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'completed' ? 'pending' : 'completed'
        };
      }
      return task;
    }));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="dashboard-logo">
          <h3>CareConnect</h3>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeView === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveView('patients')}
          >
            <FaUserMd /> <span>Patients</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveView('tasks')}
          >
            <FaClipboardList /> <span>Daily Tasks</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'medications' ? 'active' : ''}`}
            onClick={() => setActiveView('medications')}
          >
            <FaPills /> <span>Medications</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveView('calendar')}
          >
            <FaCalendarCheck /> <span>Calendar</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveView('alerts')}
          >
            <FaBell /> <span>Alerts</span>
          </button>
        </nav>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Caregiver Dashboard</h2>
          <div className="user-info">
            <span>Sarah Miller, RN</span>
            <div className="user-avatar">SM</div>
          </div>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              {activeView === 'patients' && (
                <div className="patients-view">
                  <h3>Patient List</h3>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Blood Group</th>
                          <th>address</th>
                          <th>DOB</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map((patient) => (
                          <tr key={patient._id}>
                            <td>{patient.nurseName}</td>
                            <td>{patient.email}</td>
                            <td>{patient.mobile}</td>
                            <td>{patient.age}</td>
                            <td>{patient.gender}</td>
                            <td>{patient.bloodGroup}</td>
                            <td>{patient.address}</td>
                            <td>{patient.DOB}</td>
                            <td className="action-buttons">
                              <a href={`https://wa.me/${patient.mobile}`} target="_blank" rel="noopener noreferrer" className="action-button whatsapp">
                                <FaWhatsapp />
                              </a>
                              {/* <button className="action-button view" onClick={() => alert(`View details for ${patient.patientName}`)}>
                                View
                              </button> */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeView === 'tasks' && (
                <div className="tasks-view">
                  <div className="tasks-header">
                    <h3>Daily Tasks</h3>
                    <div className="date-display">Thursday, March 20, 2025</div>
                  </div>
                  
                  <div className="tasks-grid">
                    <div className="tasks-list">
                      <h4>Today's Tasks</h4>
                      <div className="task-items">
                        {tasks
                          // .filter(task => new Date(task.dueDate) <= new Date())
                          .map(task => (
                            <div key={task.id} className={`task-item ${task.status} ${task.priority}`}>
                              <div className="task-check">
                                <input 
                                  type="checkbox" 
                                  checked={task.status === 'completed'} 
                                  onChange={() => toggleTaskStatus(task.id)} 
                                />
                              </div>
                              <div className="task-content">
                                <div className="task-description">{task.patientName}</div>
                                <div className="task-meta">
                                  <span className="task-patient">{task.status}</span>
                                  <span className="task-priority">{task.dueDate}</span>
                                  <span className="task-priority">{task.email}</span>
                                  <button  classsName="taskButton">Notify</button>
                                </div> 
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
              
                  </div>
{/*                   
                  <div className="upcoming-tasks">
                    <h4>Upcoming Tasks</h4>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Description</th>
                          <th>Due Date</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks
                          .filter(task => new Date(task.dueDate) > new Date())
                          .map(task => (
                            <tr key={task.id} className={task.status}>
                              <td>{task.patientName}</td>
                              <td>{task.description}</td>
                              <td>{task.dueDate}</td>
                              <td><span className={`priority-badge ${task.priority}`}>{task.priority}</span></td>
                              <td><span className={`status-badge ${task.status}`}>{task.status}</span></td>
                              <td>
                                <button 
                                  className="status-toggle-btn"
                                  onClick={() => toggleTaskStatus(task.id)}
                                >
                                  {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div> */}
                </div>
              )}
              
              {activeView === 'medications' && (
                <div className="placeholder-view">
                  <BlogAdd/>
                </div>
              )}
   {activeView === 'calendar' && (
                <div className="placeholder-view">
                    <AddSocialEvents/>
                </div>
              )}


{activeView === 'alerts' && (
                <div className="placeholder-view">
                   <AppointMents/>
                </div>
              )}

              
              
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CareGiverDashboard;