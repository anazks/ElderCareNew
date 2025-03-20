import React, { useEffect, useState } from 'react';
import { FaGithub, FaCalendarAlt, FaUsers, FaEye } from 'react-icons/fa';
import './pro.css';
import { useDispatch, useSelector } from "react-redux";
import Modal from './modal';
import axios from 'axios';
import FeedBack from '../projectRelated/FeedBack';
import { FiBell } from 'react-icons/fi';
// import { useDispatch, useSelector } from "react-redux";

function Projects() {
  const {
    data: { user },
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
 
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [repoData, setRepoData] = useState([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState(null);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');
  const [milestoneTitle, setMilestoneTitle] = useState('');

  // State to track selected project ID
  const [selectedProjectId, setSelectedProjectId] = useState(null);


  const [feedbackDiv,setFeedBackdiv] = useState(false)
  const[feedBacks ,setFeedbacks] = useState([])
  // Open Modal and store the project ID
  const openModal = (id) => {
    console.log('Selected Project ID:', id);
    setSelectedProjectId(id);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle Save
  const handleSave = async () => {
    console.log('Selected Project ID:', selectedProjectId);
    console.log('Feedback:', feedback);
    console.log('Milestone Date:', milestoneDate);
    console.log('Milestone Title:', milestoneTitle);

    if (!selectedProjectId) {
      console.error('No project ID selected!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/project/createFeedBack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback,
          milestoneDate,
          milestoneTitle,
          selectedProjectId
        }),
      });

      if (!response.ok) throw new Error(`Failed to update project: ${response.status}`);

      const data = await response.json();
      console.log('Project updated:', data);

      // Optionally refresh projects list after update
      fetchProjects();

    } catch (err) {
      console.error('Error updating project:', err);
    }

    closeModal();
  };

  // Fetch user projects
  const fetchProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.email) throw new Error('User email not found');
      let url;
      if(user.userType =="nurse"){
         url = `http://localhost:5000/project/getMyproject/${user.email}`
      }else{
         url = `http://localhost:5000/project/getAllProject/`
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      console.log('Projects:', data);
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const submitWork = async(id,status)=>{
  try {

    const response = await fetch(`http://localhost:5000/project/submitWork/${id}/${status}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      console.log('Projects:', data);
  } catch (error) {
      console.log(error)
  }
}

  useEffect(() => {
    fetchProjects();
  }, []);
  const feedbackhandle = async (id) => {
    try {
      console.log(id, "id");
      const response = await fetch(`http://localhost:5000/project/getFeedBack/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response,"response...")
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      if(data){
        setFeedBackdiv(true)
      }
      console.log("Feedback data:", data);
      setFeedbacks(data)

      console.log(feedback)

    } catch (error) {
      console.error("Failed to fetch feedback:", error.message);
    }
  };
  
  const updateGuid = async(id)=>{
    try {
      let user = localStorage.getItem("user")
      user = JSON.parse(user)
      const response = await fetch(`http://localhost:5000/project/updateGuid/${id}/${user.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response,"response...")
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      
    }
  }
  // Fetch GitHub commits based on repo URL
  const getDetails = async (repoUrl) => {
    if (!repoUrl) return;

    const parts = repoUrl.replace('https://github.com/', '').split('/');
    if (parts.length < 2) {
      setRepoError('Invalid GitHub repository URL');
      return;
    }

    const [owner, repo] = parts;
    try {
      setRepoLoading(true);

      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`);
      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

      const data = await response.json();
      setRepoData(data.slice(0, 5)); // Get latest 5 commits
      setDetailsVisible(true);
      setRepoError(null);
    } catch (err) {
      console.error('Error fetching commits:', err.message);
      setRepoError(err.message);
    } finally {
      setRepoLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <>
      <div className="projects-container">
        <h2 className="section-title">My Projects</h2>
        {projects.length === 0 ? (
          <div className="empty-message">You don't have any projects yet.</div>
        ) : (
          <div className="projects-row">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <div className="project-header">
                  <h3 className="project-title">{project.projectName}</h3>

                  <div style={{display:"flex",alignItems:"center",gap:"50px"}}>
                    <button className="notification-btn" onClick={() => feedbackhandle(project._id)}>
                      <FiBell className="notification-icon" />
                      Check Notifications
                    </button>
                    <br />
                    {
                      user.userType =="nurse" ?   <button className='submitWork' onClick={()=>submitWork(project._id,"Sumbited")}>Submit Work</button> : ""
                    }
                     {
                      user.userType =="doctor" ?   <button className='submitWork' onClick={()=>submitWork(project._id,"Approve")}>Approve</button> : ""
                    }
                     
                    <br />
                  </div>
                  <div className="project-date">
                    <FaCalendarAlt /> {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="project-details">
                  <div className="project-link">
                    <FaGithub />
                    <a href={project.githubRepo} target="_blank" rel="noopener noreferrer">
                      {project.githubRepo || 'No Repo'}
                    </a>
                  </div>
                  <div className={`project-status ${project.status}`}>
  Status: {project.status === "Approve" ? 
    <span style={{color:'green'}}>{project.status}</span> : 
    project.status
  }
</div>
                  <div className="project-team">
                    <FaUsers />
                    {[project.selectedNurse1, project.selectedNurse2, project.selectedNurse3, project.selectedNurse4]
                      .filter(Boolean)
                      .map((member, index) => (
                        <span key={index} className="team-member">
                          {member.charAt(0).toUpperCase()}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="project-footer">
                  <div className="project-updated">
                    Updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                  <button
                    className="view-button"
                    onClick={() => getDetails(project.githubRepo)}
                  >
                    <FaEye /> View Details
                  </button>
                  {user.userType === "doctor" && (
                    <>
                    {
                      project.guid == "not sleected" ?  <button
                      className="view-buttons"
                      onClick={() => updateGuid(project._id)}
                    >
                      Accept
                    </button> : 
                    <div className="project-updated">
                    Guid: {project.guid}
                  </div>
                    }
                      
                    </>
                  )}
                  
                </div>
                {user.userType === "doctor" && (
                    <>
                      <button
                        className="view-buttons"
                        onClick={() => openModal(project._id)}
                      >
                        Update
                      </button>
                    </>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for updating project */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        feedback={feedback}
        setFeedback={setFeedback}
        milestoneDate={milestoneDate}
        setMilestoneDate={setMilestoneDate}
        milestoneTitle={milestoneTitle}
        setMilestoneTitle={setMilestoneTitle}
      />

      {/* GitHub Details Box */}
      {detailsVisible && (
        <div className="github-box">
          <h3 className="github-title">Recent Commits</h3>
          {repoLoading && <p className="github-loading">Loading GitHub data...</p>}
          {repoError && <p className="github-error">Error: {repoError}</p>}
          <ul className="github-commit-list">
            {repoData.map((commit) => (
              <li key={commit.sha} className="github-commit-item">
                <p className="commit-message"><span style={{color:"green"}}>Task</span><h2><span>{commit.commit.message}</span></h2></p>
                <p>By: {commit.commit.author.name}</p>
                <p>Date: {commit.commit.author.date}</p>
                <button className='btn-success'>
                <a href={commit.html_url} target="_blank" rel="noopener noreferrer">
                  Check Code
                </a>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <FeedBack  feedBacks={feedBacks}/>
            
      </div>

    </>
  );
}

export default Projects;
