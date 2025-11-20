// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./Header";
import Hero from "./Hero";
import Stats from "./Stats";
import Features from "./Features";
import JobSeekers from "./JobSeekers";
import Recruiters from "./Recruiters";
import Testimonials from "./Testimonials";
import CTA from "./CTA";
import Footer from "./Footer";

import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import JobDetails from "./pages/JobDetails";
import FindJobs from "./pages/FindJobs";

import JobPortal from "./JobPortal";
import CreateProfile from "./pages/CreateProfile";
import AccountVerified from "./pages/AccountVerified";

import { UserProvider, useUser } from "./UserContext";
import { JobProvider } from "./JobContext";

function Landing() {
  return (
    <>
      <Header />
      <Hero />
      <Stats />
      <Features />
      <JobSeekers />
      <Recruiters />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}

/* 🔐 Updated protected route with role guard */
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const role = user?.user_metadata?.type;

  // 🚫 Unauthorized user hits another role dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "recruiter") return <Navigate to="/recruiter" replace />;
    if (role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/jobseeker" replace />;
  }

  return children;
}

function App() {
  return (
    <UserProvider>
      <JobProvider>
        <Router>
          <Routes>
            {/* 🌍 Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account-verified" element={<AccountVerified />} />

            {/* External + manual jobs page (Find Jobs) */}
            <Route path="/find-jobs" element={<FindJobs />} />

            <Route path="/job-details/:id" element={<JobDetails />} />

            {/* 👤 Job Seeker Protected Routes */}
            <Route
              path="/jobseeker"
              element={
                <ProtectedRoute allowedRoles={["jobseeker"]}>
                  <JobSeekerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-profile"
              element={
                <ProtectedRoute allowedRoles={["jobseeker"]}>
                  <CreateProfile />
                </ProtectedRoute>
              }
            />

            {/* 🏢 Recruiter Protected Routes */}
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />

            {/* ⚙ Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 🔁 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </JobProvider>
      <ToastContainer position="top-center" autoClose={2500} pauseOnHover />
    </UserProvider>
  );
}

export default App;
















// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import Header from './Header';
// import Hero from './Hero';
// import Stats from './Stats';
// import Features from './Features';
// import JobSeekers from './JobSeekers';
// import Recruiters from './Recruiters';
// import Testimonials from './Testimonials';
// import CTA from './CTA';
// import Footer from './Footer';

// import JobSeekerDashboard from './pages/JobSeekerDashboard';
// import RecruiterDashboard from './pages/RecruiterDashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import Login from './pages/Login';
// import JobDetails from './pages/JobDetails';
// import JobPortal from './JobPortal';
// import CreateProfile from './pages/CreateProfile';

// import AccountVerified from './pages/AccountVerified'; // ✅ NEW

// import { UserProvider, useUser } from './UserContext';
// import { JobProvider } from './JobContext';

// function Landing() {
//   return (
//     <>
//       <Header />
//       <Hero />
//       <Stats />
//       <Features />
//       <JobSeekers />
//       <Recruiters />
//       <Testimonials />
//       <CTA />
//       <Footer />
//     </>
//   );
// }

// function ProtectedRoute({ children }) {
//   const { user, loading } = useUser();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!user) return <Navigate to="/login" replace />;
//   return children;
// }

// function App() {
//   return (
//     <UserProvider>
//       <JobProvider>
//         <Router>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Landing />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/account-verified" element={<AccountVerified />} /> {/* ⭐ NEW */}
//             <Route path="/find-jobs" element={<JobPortal />} />
//             <Route path="/job-details/:id" element={<JobDetails />} /> {/* Public job view allowed */}

//             {/* Protected Routes */}
//             <Route path="/jobseeker" element={<ProtectedRoute><JobSeekerDashboard /></ProtectedRoute>} />
//             <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
//             <Route path="/recruiter" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
//             <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

//             {/* Catch-All Redirect */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </Router>
//       </JobProvider>
//     </UserProvider>
//   );
// }

// export default App;











