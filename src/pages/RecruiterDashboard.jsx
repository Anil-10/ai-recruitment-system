import React, { useState, useRef } from "react";
import { useUser } from "../UserContext";
import { useJobs } from "../JobContext";
import { useNavigate } from "react-router-dom";
import AIScreening from "../components/AIScreening";
import ResumeShortlisting from "../components/ResumeShortlisting";
import DashboardNav from "../components/DashboardNav";
import { showSuccess } from "../utils/toast";
import "./Dashboard.css";

function formatPostedDate(createdAt) {
  if (!createdAt) return "Not available";
  
  const created = new Date(createdAt);
  if (isNaN(created)) return "Not available";

  const now = new Date();
  const diffMs = now - created;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);

  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const dd = String(created.getDate()).padStart(2, "0");
  const mm = String(created.getMonth() + 1).padStart(2, "0");
  const yyyy = created.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

function RecruiterDashboard() {
  const { user, logout } = useUser();
  const { jobs, addJob } = useJobs(); // ❌ Removed getApplicationsByJob
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: "",
    experience: "",
    education: "",
    department: "",
    remote: false,
  });

  const postJobRef = useRef(null);
  const shortlistRef = useRef(null);
  const interviewRef = useRef(null);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handlePost = async (e) => {
    e.preventDefault();

    if (!job.title || !job.company || !job.location || !job.description || !job.skills) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    try {
      await addJob({
        ...job,
        skills: job.skills.split(",").map((s) => s.trim()), // Convert to array
      });

      showSuccess("Job posted successfully!");
      setJob({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salary: "",
        description: "",
        requirements: "",
        benefits: "",
        skills: "",
        experience: "",
        education: "",
        department: "",
        remote: false,
      });
    } catch (err) {
      console.error("Error posting job:", err.message);
      alert("Failed to post job. Check console for more details.");
    }
  };

  const handleLogout = () => {
  logout();
  showSuccess("Logged out successfully!");
  navigate("/login");
};

  const myJobs = jobs.filter((j) => j.recruiter_id === user?.id);

  return (
    <div className="dashboard recruiter-dashboard">
      <DashboardNav />
      <div className="user-info-bar">
        <span>
          Logged in as: <strong>{user?.email}</strong> (Recruiter)
        </span>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h2>Recruiter Dashboard</h2>

      {/* POST NEW JOB */}
      <section ref={postJobRef}>
        <h3>Post New Job</h3>
        <div className="job-posting-form">
          <form onSubmit={handlePost} className="job-form">
            <div className="form-grid">

              {/* Basic Info */}
              <div className="form-section">
                <h4>Basic Information</h4>

                <div className="form-row">
                  <input name="title" placeholder="Job Title *" value={job.title} onChange={handleChange} required className="form-input" />
                  <input name="company" placeholder="Company Name *" value={job.company} onChange={handleChange} required className="form-input" />
                </div>

                <div className="form-row">
                  <input name="location" placeholder="Location *" value={job.location} onChange={handleChange} required className="form-input" />
                  <select name="type" value={job.type} onChange={handleChange} className="form-input">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div className="form-row">
                  <input name="salary" placeholder="Salary Range (e.g., ₹8-12 LPA)" value={job.salary} onChange={handleChange} className="form-input" />
                  <input name="department" placeholder="Department" value={job.department} onChange={handleChange} className="form-input" />
                </div>

                <label className="checkbox-label">
                  <input type="checkbox" name="remote" checked={job.remote} onChange={(e) => setJob({ ...job, remote: e.target.checked })} />
                  Remote Work Available
                </label>
              </div>

              {/* Job Details */}
              <div className="form-section">
                <h4>Job Details</h4>
                <textarea name="description" placeholder="Job Description *" value={job.description} onChange={handleChange} required rows={4} className="form-textarea" />
                <textarea name="requirements" placeholder="Requirements (one per line)" value={job.requirements} onChange={handleChange} rows={4} className="form-textarea" />
                <textarea name="benefits" placeholder="Benefits & Perks (one per line)" value={job.benefits} onChange={handleChange} rows={3} className="form-textarea" />
              </div>

              {/* Skills */}
              <div className="form-section">
                <h4>Skills & Experience</h4>
                <input name="skills" placeholder="Required Skills (comma separated) *" value={job.skills} onChange={handleChange} required className="form-input" />
                <div className="form-row">
                  <input name="experience" placeholder="Experience Required (e.g., 3-5 years)" value={job.experience} onChange={handleChange} className="form-input" />
                  <input name="education" placeholder="Education Required" value={job.education} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Post Job</button>
            </div>
          </form>
        </div>

        {/* Posted Jobs */}
<div className="posted-jobs">
  <h4>Posted Jobs ({myJobs.length})</h4>

  {myJobs.length === 0 ? (
    <p className="no-jobs">You haven't posted any jobs yet.</p>
  ) : (
    <div className="jobs-grid">
      {myJobs.map((j) => {
        // normalize skills safely
        const skillsArray = Array.isArray(j.skills)
          ? j.skills
          : (j.skills || "").split(",").map(s => s.trim()).filter(Boolean);

        // compute posted label
        const postedLabel = formatPostedDate(j.created_at || j.postedDate);

        return (
          <div key={j.id} className="job-card">
            <div className="job-header">
              <h5>{j.title}</h5>
              <span className="job-type">{j.type}</span>
            </div>

            <p className="job-company">
              {j.company} • {j.location}
            </p>

            {j.salary && <p className="job-salary">{j.salary}</p>}

            <p className="job-description">
              {j.description ? `${j.description.substring(0, 100)}...` : ""}
            </p>

            <div className="job-skills">
              {skillsArray.slice(0, 3).map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>

            {/* meta row: posted date + optional applicants count */}
            <div className="job-meta" style={{ marginTop: 8 }}>
              <div className="meta-left">
                <div className="posted">
                  <span className="label">Posted:</span>
                  <span className="date" style={{ marginLeft: 8, fontWeight: 700 }}>
                    {postedLabel}
                  </span>
                </div>
              </div>

              <div className="meta-right">
                <div className="applicants">
                  {j.applicants ?? 0} applicants
                </div>
              </div>
            </div>

            <div className="job-actions">
              <button className="btn-edit">Edit</button>
              <button className="btn-view" disabled>
                View Applications (Coming Soon)
              </button>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>

      </section>

      {/* AI & Shortlisting */}
      <section ref={shortlistRef}>
        <h3>AI Shortlisting</h3>
        <AIScreening />
        <ResumeShortlisting />
      </section>

      {/* Analytics */}
      <section ref={interviewRef}>
        <h3>Analytics</h3>
        <div className="recruiter-analytics-placeholder">
          <em>[Recruiter analytics / insights will appear here]</em>
        </div>
      </section>
    </div>
  );
}

export default RecruiterDashboard;










// import React, { useState, useRef } from "react";
// import { useUser } from "../UserContext";
// import { useJobs } from "../JobContext";
// import { useNavigate } from "react-router-dom";
// import AIScreening from "../components/AIScreening";
// import ResumeShortlisting from "../components/ResumeShortlisting";
// import DashboardNav from "../components/DashboardNav";
// import "./Dashboard.css";

// function RecruiterDashboard() {
//   const { user, logout } = useUser();
//   const { jobs, addJob, getApplicationsByJob } = useJobs();
//   const navigate = useNavigate();

//   const [job, setJob] = useState({
//     title: "",
//     company: "",
//     location: "",
//     type: "Full-time",
//     salary: "",
//     description: "",
//     requirements: "",
//     benefits: "",
//     skills: "",
//     experience: "",
//     education: "",
//     department: "",
//     remote: false,
//   });

//   const postJobRef = useRef(null);
//   const shortlistRef = useRef(null);
//   const interviewRef = useRef(null);

//   const handleChange = (e) => {
//     setJob({ ...job, [e.target.name]: e.target.value });
//   };

//   const handlePost = async (e) => {
//     e.preventDefault();

//     if (!job.title || !job.company || !job.location || !job.description || !job.skills) {
//       alert("Please fill in all required fields marked with *");
//       return;
//     }

//     try {
//       await addJob({
//         ...job,
//         skills: job.skills.split(",").map((s) => s.trim()), // Convert to array for Supabase
//       });

//       alert("Job posted successfully!");
//       setJob({
//         title: "",
//         company: "",
//         location: "",
//         type: "Full-time",
//         salary: "",
//         description: "",
//         requirements: "",
//         benefits: "",
//         skills: "",
//         experience: "",
//         education: "",
//         department: "",
//         remote: false,
//       });
//     } catch (err) {
//       console.error("Error posting job:", err.message);
//       alert("Failed to post job. Check console for more details.");
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const myJobs = jobs.filter((j) => j.recruiter_id === user?.id);

//   return (
//     <div className="dashboard recruiter-dashboard">
//       <DashboardNav />
//       <div className="user-info-bar">
//         <span>
//           Logged in as: <strong>{user?.email}</strong> (Recruiter)
//         </span>
//         <button onClick={handleLogout}>Logout</button>
//       </div>

//       <h2>Recruiter Dashboard</h2>

//       {/* POST NEW JOB */}
//       <section ref={postJobRef}>
//         <h3>Post New Job</h3>
//         <div className="job-posting-form">
//           <form onSubmit={handlePost} className="job-form">
//             <div className="form-grid">

//               {/* Basic Info */}
//               <div className="form-section">
//                 <h4>Basic Information</h4>

//                 <div className="form-row">
//                   <input name="title" placeholder="Job Title *" value={job.title} onChange={handleChange} required className="form-input" />
//                   <input name="company" placeholder="Company Name *" value={job.company} onChange={handleChange} required className="form-input" />
//                 </div>

//                 <div className="form-row">
//                   <input name="location" placeholder="Location *" value={job.location} onChange={handleChange} required className="form-input" />
//                   <select name="type" value={job.type} onChange={handleChange} className="form-input">
//                     <option value="Full-time">Full-time</option>
//                     <option value="Part-time">Part-time</option>
//                     <option value="Contract">Contract</option>
//                     <option value="Internship">Internship</option>
//                     <option value="Freelance">Freelance</option>
//                   </select>
//                 </div>

//                 <div className="form-row">
//                   <input name="salary" placeholder="Salary Range (e.g., ₹8-12 LPA)" value={job.salary} onChange={handleChange} className="form-input" />
//                   <input name="department" placeholder="Department" value={job.department} onChange={handleChange} className="form-input" />
//                 </div>

//                 <label className="checkbox-label">
//                   <input type="checkbox" name="remote" checked={job.remote} onChange={(e) => setJob({ ...job, remote: e.target.checked })} />
//                   Remote Work Available
//                 </label>
//               </div>

//               {/* Job Details */}
//               <div className="form-section">
//                 <h4>Job Details</h4>
//                 <textarea name="description" placeholder="Job Description *" value={job.description} onChange={handleChange} required rows={4} className="form-textarea" />
//                 <textarea name="requirements" placeholder="Requirements (one per line)" value={job.requirements} onChange={handleChange} rows={4} className="form-textarea" />
//                 <textarea name="benefits" placeholder="Benefits & Perks (one per line)" value={job.benefits} onChange={handleChange} rows={3} className="form-textarea" />
//               </div>

//               {/* Skills */}
//               <div className="form-section">
//                 <h4>Skills & Experience</h4>
//                 <input name="skills" placeholder="Required Skills (comma separated) *" value={job.skills} onChange={handleChange} required className="form-input" />
//                 <div className="form-row">
//                   <input name="experience" placeholder="Experience Required (e.g., 3-5 years)" value={job.experience} onChange={handleChange} className="form-input" />
//                   <input name="education" placeholder="Education Required" value={job.education} onChange={handleChange} className="form-input" />
//                 </div>
//               </div>
//             </div>

//             <div className="form-actions">
//               <button type="submit" className="btn-primary">Post Job</button>
//             </div>
//           </form>
//         </div>

//         {/* Posted Jobs */}
//         <div className="posted-jobs">
//           <h4>Posted Jobs ({myJobs.length})</h4>

//           {myJobs.length === 0 ? (
//             <p className="no-jobs">You haven't posted any jobs yet.</p>
//           ) : (
//             <div className="jobs-grid">
//               {myJobs.map((j) => (
//                 <div key={j.id} className="job-card">
//                   <div className="job-header">
//                     <h5>{j.title}</h5>
//                     <span className="job-type">{j.type}</span>
//                   </div>
//                   <p className="job-company">
//                     {j.company} • {j.location}
//                   </p>
//                   {j.salary && <p className="job-salary">{j.salary}</p>}
//                   <p className="job-description">{j.description?.substring(0, 100)}...</p>

//                   <div className="job-skills">
//                     {(Array.isArray(j.skills) ? j.skills : j.skills.split(","))
//                       .slice(0, 3)
//                       .map((skill, i) => (
//                         <span key={i} className="skill-tag">{skill}</span>
//                       ))}
//                   </div>

//                   <div className="job-actions">
//                     <button className="btn-edit">Edit</button>
//                     <button className="btn-view">
//                       View Applications ({getApplicationsByJob(j.id).length})
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* AI & Shortlisting */}
//       <section ref={shortlistRef}>
//         <h3>AI Shortlisting</h3>
//         <AIScreening />
//         <ResumeShortlisting />
//       </section>

//       {/* Analytics */}
//       <section ref={interviewRef}>
//         <h3>Analytics</h3>
//         <div className="recruiter-analytics-placeholder">
//           <em>[Recruiter analytics/insights will appear here]</em>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default RecruiterDashboard;













