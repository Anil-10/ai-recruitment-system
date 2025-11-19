import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { toast } from "react-toastify";

function Recruiters() {
  const navigate = useNavigate();
  const { user } = useUser();
  const role = user?.user_metadata?.type;

  const handlePostJob = () => {

    if (!user) {
      toast.error("Please login to continue!");
      navigate("/login?from=unauthorized-post-job");
      return;
    }

    if (role === "recruiter") {
      navigate("/recruiter");
      return;
    }

    toast.error("Only recruiters can post jobs — please login as recruiter!");
    navigate("/login?from=unauthorized-post-job");
  };
  
  return (
    <section id="recruiters" className="role-section recruiters">
      <div className="container">
        <div className="role-content reverse">
          <div className="role-image" data-aos="fade-right">
            <img
              src="https://images.pexels.com/photos/6893899/pexels-photo-6893899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Recruiter using platform"
            />
          </div>
          <div className="role-text" data-aos="fade-left">
            <h2>For Recruiters</h2>
            <p className="section-subtitle">
              Find the best candidates faster with AI-powered tools
            </p>
            <ul className="feature-list">
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <h4>Candidate Ranking</h4>
                  <p>
                    AI-driven ranking of applicants based on job fit, skills,
                    experience, and experience.
                  </p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <h4>Smart Screening</h4>
                  <p>
                    Automate initial candidate screening to save time and
                    resources.
                  </p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <h4>Diversity Insights</h4>
                  <p>
                    Monitor diversity metrics and get suggestions to improve
                    inclusive hiring.
                  </p>
                </div>
              </li>
            </ul>
            <button className="btn btn-primary" onClick={handlePostJob}>
              Post a Job
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Recruiters;










// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function Recruiters() {
//   const navigate = useNavigate();

//   const handlePostJob = () => {
//     navigate('/recruiter');
//   };

//   return (
//     <section id="recruiters" className="role-section recruiters">
//       <div className="container">
//         <div className="role-content reverse">
//           <div className="role-image" data-aos="fade-right">
//             <img src="https://images.pexels.com/photos/6893899/pexels-photo-6893899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Recruiter using platform" />
//           </div>
//           <div className="role-text" data-aos="fade-left">
//             <h2>For Recruiters</h2>
//             <p className="section-subtitle">Find the best candidates faster with AI-powered tools</p>
//             <ul className="feature-list">
//               <li>
//                 <span className="check-icon">✓</span>
//                 <div>
//                   <h4>Candidate Ranking</h4>
//                   <p>AI-driven ranking of applicants based on job fit, skills, experience, and experience.</p>
//                 </div>
//               </li>
//               <li>
//                 <span className="check-icon">✓</span>
//                 <div>
//                   <h4>Smart Screening</h4>
//                   <p>Automate initial candidate screening to save time and resources.</p>
//                 </div>
//               </li>
//               <li>
//                 <span className="check-icon">✓</span>
//                 <div>
//                   <h4>Diversity Insights</h4>
//                   <p>Monitor diversity metrics and get suggestions to improve inclusive hiring.</p>
//                 </div>
//               </li>
//             </ul>
//             <button className="btn btn-primary" onClick={handlePostJob}>Post a Job</button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Recruiters; 