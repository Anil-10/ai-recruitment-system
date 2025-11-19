import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { supabase } from "../supabaseClient";
import DashboardNav from "../components/DashboardNav";
import { showSuccess } from "../utils/toast";
import "./Login.css";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUserSession } = useUser();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "jobseeker",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Detect SignUp = ?register=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsRegister(params.get("register") === "true");
  }, [location.search]);

  // 🔹 Auto redirect if logged in — with unauthorized override
  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(location.search);
    const from = params.get("from");

    // NEW: Skip redirect if redirected due to role restriction
    if (
      from === "unauthorized-post-job" ||
      from === "unauthorized-create-profile"
    ) {
      return; // stay on login page
    }

    const role = user?.user_metadata?.type;

    if (role === "recruiter") navigate("/recruiter");
    else if (role === "admin") navigate("/admin");
    else navigate("/jobseeker");
  }, [user, navigate, location.search]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isRegister) {
      if (!formData.agreeToTerms) {
        setError("You must agree to the terms.");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      const { error: signupError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/account-verified`,
          data: {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            mobile: formData.mobile.trim(),
            type: formData.userType,
          },
        },
      });

      if (signupError) {
        setError(signupError.message);
      } else {
        showSuccess("Account created! Verify your email to continue.");
      }
    } else {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (loginError) {
        setError("Wrong credentials, please try again.");
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const loggedInUser = sessionData?.session?.user;

      if (!loggedInUser?.email_confirmed_at) {
        setError("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      setUserSession(loggedInUser);
      showSuccess(`Welcome back, ${loggedInUser.user_metadata.firstName}!`);
    }

    setLoading(false);
  };

  const toggleForm = () => {
    const newForm = !isRegister;
    window.history.replaceState(null, "", newForm ? "/login?register=true" : "/login");
    setIsRegister(newForm);

    setFormData({
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "jobseeker",
      agreeToTerms: false,
    });
    setError("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <DashboardNav />
        <h2>{isRegister ? "Create Account" : "Sign In"}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <>
              <div className="form-grid">
                <div className="input-group">
                  <User className="input-icon" size={20} />
                  <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
                </div>

                <div className="input-group">
                  <User className="input-icon" size={20} />
                  <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                </div>
              </div>

              <div className="input-group">
                <Phone className="input-icon" size={20} />
                <input type="text" name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
              </div>
            </>
          )}

          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isRegister && (
            <>
              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="input-group">
                <select name="userType" value={formData.userType} onChange={handleChange}>
                  <option value="jobseeker">🔍 Job Seeker</option>
                  <option value="recruiter">🏢 Recruiter</option>
                  <option value="admin">⚙ Admin</option>
                </select>
              </div>

              <div className="checkbox-group">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
                <label>I agree to Terms & Privacy Policy</label>
              </div>
            </>
          )}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Loading..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <button className="switch-button" onClick={toggleForm}>
          {isRegister ? "Already have an account? Sign In" : "Don’t have an account? Register"}
        </button>
      </div>
    </div>
  );
}

export default Login;











// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useUser } from "../UserContext";
// import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
// import { supabase } from "../supabaseClient";
// import DashboardNav from "../components/DashboardNav";
// import "./Login.css";

// function Login() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, setUserSession } = useUser();

//   const [isRegister, setIsRegister] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     mobile: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     userType: "jobseeker",
//     agreeToTerms: false,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Detect ?register=true
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     setIsRegister(params.get("register") === "true");
//   }, [location.search]);

//   // Auto redirect if logged in
//   useEffect(() => {
//     if (!user) return;
//     const role = user?.user_metadata?.type;

//     if (role === "recruiter") navigate("/recruiter");
//     else if (role === "admin") navigate("/admin");
//     else navigate("/jobseeker");
//   }, [user, navigate]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (isRegister) {
//       if (!formData.agreeToTerms) {
//         setError("You must agree to the terms.");
//         setLoading(false);
//         return;
//       }

//       if (formData.password !== formData.confirmPassword) {
//         setError("Passwords do not match.");
//         setLoading(false);
//         return;
//       }

//       const { error: signupError } = await supabase.auth.signUp({
//         email: formData.email.trim(),
//         password: formData.password,
//         options: {
//           emailRedirectTo: `${window.location.origin}/account-verified`,
//           data: {
//             firstName: formData.firstName.trim(),
//             lastName: formData.lastName.trim(),
//             mobile: formData.mobile.trim(),
//             type: formData.userType,
//           },
//         },
//       });

//       if (signupError) {
//         setError(signupError.message);
//       } else {
//         alert("🎉 Account created! Please verify your email to continue.");
//       }
//     } else {
//       const { data, error: loginError } = await supabase.auth.signInWithPassword({
//         email: formData.email.trim(),
//         password: formData.password,
//       });

//       if (loginError) {
//         setError("Wrong credentials, please try again.");
//         setLoading(false);
//         return;
//       }

//       const { data: sessionData } = await supabase.auth.getSession();
//       const loggedInUser = sessionData?.session?.user;

//       if (!loggedInUser?.email_confirmed_at) {
//         setError("Please verify your email before logging in.");
//         setLoading(false);
//         return;
//       }

//       setUserSession(loggedInUser);
//     }

//     setLoading(false);
//   };

//   const toggleForm = () => {
//     const newForm = !isRegister;
//     window.history.replaceState(null, "", newForm ? "/login?register=true" : "/login");
//     setIsRegister(newForm);

//     setFormData({
//       firstName: "",
//       lastName: "",
//       mobile: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       userType: "jobseeker",
//       agreeToTerms: false,
//     });
//     setError("");
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <DashboardNav />
//         <h2>{isRegister ? "Create Account" : "Sign In"}</h2>

//         <form onSubmit={handleSubmit} className="auth-form">
//           {isRegister && (
//             <>
//               <div className="form-grid">
//                 <div className="input-group">
//                   <User className="input-icon" size={20} />
//                   <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
//                 </div>

//                 <div className="input-group">
//                   <User className="input-icon" size={20} />
//                   <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
//                 </div>
//               </div>

//               <div className="input-group">
//                 <Phone className="input-icon" size={20} />
//                 <input type="text" name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
//               </div>
//             </>
//           )}

//           <div className="input-group">
//             <Mail className="input-icon" size={20} />
//             <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//           </div>

//           <div className="input-group">
//             <Lock className="input-icon" size={20} />
//             <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required />
//             <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {isRegister && (
//             <>
//               <div className="input-group">
//                 <Lock className="input-icon" size={20} />
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   placeholder="Confirm Password"
//                   onChange={handleChange}
//                   required
//                 />
//                 <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                   {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>

//               <div className="input-group">
//                 <select name="userType" value={formData.userType} onChange={handleChange}>
//                   <option value="jobseeker">🔍 Job Seeker</option>
//                   <option value="recruiter">🏢 Recruiter</option>
//                   <option value="admin">⚙ Admin</option>
//                 </select>
//               </div>

//               <div className="checkbox-group">
//                 <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
//                 <label>I agree to Terms & Privacy Policy</label>
//               </div>
//             </>
//           )}

//           {error && <p className="error-message">{error}</p>}

//           <button type="submit" className="submit-button" disabled={loading}>
//             {loading ? "Loading..." : isRegister ? "Create Account" : "Sign In"}
//           </button>
//         </form>

//         <button className="switch-button" onClick={toggleForm}>
//           {isRegister ? "Already have an account? Sign In" : "Don’t have an account? Register"}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Login;




