import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

// 💡 If showSuccess comes from a toast system or global function,
// make sure it is imported here:
// import { showSuccess } from "../utils/toast";  <- adjust path

const AccountVerified = () => {
  const navigate = useNavigate();
  const { user, showSuccess } = useUser(); 
  // If showSuccess is NOT inside useUser, tell me the correct location.

  useEffect(() => {
    // 🎉 Show success message once
    if (showSuccess) {
      showSuccess("Email verified! Let's continue.");
    }

    // ⏳ Redirect in 2 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, showSuccess]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20vh",
        animation: "fadeIn .6s ease-out",
      }}
    >
      <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>
        🎉 Account Verified Successfully!
      </h2>
      <p style={{ fontSize: "18px", color: "#555" }}>
        Redirecting you to login...
      </p>

      {/* Small inline animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default AccountVerified;










// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../UserContext";

// const AccountVerified = () => {
//   const navigate = useNavigate();
//   const { user } = useUser();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const role = user?.user_metadata?.type;
//       if (role === "recruiter") navigate("/recruiter");
//       else navigate("/jobseeker");
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, [user, navigate]);

//   return (
//     <div style={{ textAlign: "center", marginTop: "20vh" }}>
//       <h2>🎉 Account Verified Successfully!</h2>
//       <p>Redirecting you to your dashboard...</p>
//     </div>
//   );
// };

// export default AccountVerified;
