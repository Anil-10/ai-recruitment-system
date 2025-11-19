







// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useUser } from "../UserContext";
// import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
// import "./Login.css";

// function Register() {
//   const navigate = useNavigate();
//   const { register } = useUser();

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     userType: "jobseeker",
//     agreeToTerms: false,
//   });

//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
//     setErrors((x) => ({ ...x, [name]: "" }));
//   };

//   const validate = () => {
//     const e = {};
//     if (!formData.firstName) e.firstName = "Required";
//     if (!formData.lastName) e.lastName = "Required";
//     if (!formData.email) e.email = "Required";
//     if (!formData.password || formData.password.length < 8) e.password = "Min 8 characters";
//     if (formData.password !== formData.confirmPassword) e.confirm = "Passwords do not match";
//     if (!formData.agreeToTerms) e.terms = "Required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);
//     const result = await register(formData.email, formData.password, formData.userType);
//     setLoading(false);

//     if (!result.success) return setErrors({ general: result.error });

//     if (formData.userType === "recruiter") navigate("/recruiter");
//     else navigate("/jobseeker");
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>Create Account</h2>

//         <form onSubmit={submit} className="auth-form">
//           <div className="form-grid">
//             <div className="input-group">
//               <User size={20} />
//               <input name="firstName" placeholder="First Name" onChange={handleChange} />
//             </div>
//             <div className="input-group">
//               <User size={20} />
//               <input name="lastName" placeholder="Last Name" onChange={handleChange} />
//             </div>
//           </div>

//           <div className="input-group">
//             <Mail size={20} />
//             <input name="email" placeholder="Email" onChange={handleChange} />
//           </div>

//           <div className="input-group">
//             <Lock size={20} />
//             <input type={showPass ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} />
//             <button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff /> : <Eye />}</button>
//           </div>

//           <div className="input-group">
//             <Lock size={20} />
//             <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
//             <button type="button" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <EyeOff /> : <Eye />}</button>
//           </div>

//           <select name="userType" value={formData.userType} onChange={handleChange}>
//             <option value="jobseeker">Job Seeker</option>
//             <option value="recruiter">Recruiter</option>
//             <option value="admin">Admin</option>
//           </select>

//           <div className="checkbox-group">
//             <input type="checkbox" name="agreeToTerms" onChange={handleChange} />
//             <label>I agree to terms</label>
//           </div>

//           {Object.values(errors).map((err, i) => <p key={i} className="error-text">{err}</p>)}

//           <button className="submit-button" disabled={loading}>
//             {loading ? "..." : "Sign Up"}
//           </button>
//         </form>

//         <p>
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Register;




