import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { toast } from "react-toastify";

function JobSeekers() {
  const navigate = useNavigate();
  const { user } = useUser();
  const role = user?.user_metadata?.type;

  const handleCreateProfile = () => {

    if (!user) {
      toast.error("Please login to continue!");
      navigate("/login?from=unauthorized-create-profile");
      return;
    }

    if (role === "jobseeker") {
      navigate("/create-profile");
      return;
    }

    toast.error("Only job seekers can create profile — login as jobseeker!");
    navigate("/login?from=unauthorized-create-profile");
  };
  
  return (
    <section id="job-seekers" className="role-section job-seekers">
      <div className="container">
        <div className="role-content">
          <div className="role-text" data-aos="fade-right">
            <h2>For Job Seekers</h2>
            <p className="section-subtitle">
              Find the perfect job that matches your skills and career goals
            </p>
            <ul className="feature-list">
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <h4>Smart Recommendations</h4>
                  <p>
                    Receive personalized job recommendations based on your
                    skills, experience, and career goals.
                  </p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <h4>Resume Analysis</h4>
                  <p>
                    Get insights on how to improve your resume and match it to
                    job requirements.
                  </p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <h4>Application Tracking</h4>
                  <p>
                    Track your applications in real-time and receive updates on
                    your status.
                  </p>
                </div>
              </li>
            </ul>
            <button className="btn btn-primary" onClick={handleCreateProfile}>
              Create Your Profile
            </button>
          </div>
          <div className="role-image" data-aos="fade-left">
            <img
              src="https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Job seeker using platform"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default JobSeekers;











// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function JobSeekers() {
//   const navigate = useNavigate();

//   const handleCreateProfile = () => {
//     navigate('/create-profile');
//   };

//   return (
//     <section id="job-seekers" className="role-section job-seekers">
//       <div className="container">
//         <div className="role-content">
//           <div className="role-text" data-aos="fade-right">
//             <h2>For Job Seekers</h2>
//             <p className="section-subtitle">Find the perfect job that matches your skills and career goals</p>
//             <ul className="feature-list">
//               <li>
//                 <span className="check-icon">✓</span>
//                 <div>
//                   <h4>Smart Recommendations</h4>
//                   <p>Receive personalized job recommendations based on your skills, experience, and career goals.</p>
//                 </div>
//               </li>
//               <li>
//                 <span className="check-icon">✓</span>
//                 <div>
//                   <h4>Resume Analysis</h4>
//                   <p>Get insights on how to improve your resume and match it to job requirements.</p>
//                 </div>
//               </li>
//               <li>
//                 <span className="check-icon">✓</span>
//                 <div>
//                   <h4>Application Tracking</h4>
//                   <p>Track your applications in real-time and receive updates on your status.</p>
//                 </div>
//               </li>
//             </ul>
//             <button className="btn btn-primary" onClick={handleCreateProfile}>Create Your Profile</button>
//           </div>
//           <div className="role-image" data-aos="fade-left">
//             <img src="https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Job seeker using platform" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default JobSeekers;