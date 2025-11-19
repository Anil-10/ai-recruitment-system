import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useUser } from "../UserContext";

const DashboardNav = () => {
  const navigate = useNavigate();
  const { user, logoutSession } = useUser();

  const role = user?.user_metadata?.type;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logoutSession();
    navigate("/login");
  };

  return (
    <nav style={{
      background: "#f8f9ff",
      padding: "12px 20px",
      borderBottom: "1px solid #ddd",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ fontWeight: "bold" }}>🏠 Home</Link>
        {role === "jobseeker" && (
          <Link to="/find-jobs" style={{ fontWeight: "bold" }}>🔍 Find Jobs</Link>
        )}
      </div>

      {/* <button
        onClick={handleLogout}
        style={{
          background: "#E63946",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: "5px",
          cursor: "pointer",
          border: "none"
        }}
      >
        Logout
      </button> */}
    </nav>
  );
};

export default DashboardNav;
