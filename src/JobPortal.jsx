import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "./JobContext";
import JobCard from "./components/JobCard";
import LoadingSpinner from "./components/LoadingSpinner";
import "./pages/JobPortal.css";

function JobPortal() {
  const navigate = useNavigate();

  // 🔥 Fetch real jobs from Supabase
  const { jobs, loadingJobs, fetchJobs } = useJobs();

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Load jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Filtering Logic
  useEffect(() => {
    if (!jobs) return;

    let filtered = [...jobs];

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (Array.isArray(job.skills)
            ? job.skills
            : typeof job.skills === "string"
            ? job.skills.split(",")
            : []
          ).some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((job) =>
        job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((job) => job.type === typeFilter);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, locationFilter, typeFilter, jobs]);

  // Fallback when no results
  const resetFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setTypeFilter("");
  };

  return (
    <div className="job-portal-container">
      
      {/* Header */}
      <header className="job-portal-header">
        <div className="job-portal-header-content">
          <h1 className="job-portal-logo" onClick={() => navigate("/")}>
            TalentMatch AI
          </h1>
          <nav className="job-portal-nav">
            <button onClick={() => navigate("/")}>Home</button>
            <button
              onClick={() => navigate("/login")}
              className="job-portal-login-btn"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Search */}
      <div className="job-portal-search">
        <div className="job-portal-search-content">
          <div className="job-portal-search-grid">
            <input
              type="text"
              placeholder="Job title or keywords"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="job-portal-search-input"
            />
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="job-portal-search-input"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="job-portal-search-select"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            <button className="job-portal-clear-btn" onClick={resetFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="job-portal-main">
        <div className="job-portal-results-header">
          <h2 className="job-portal-results-title">
            {loadingJobs
              ? "Loading Jobs..."
              : `${filteredJobs.length} Jobs Found`}
          </h2>
        </div>

        {loadingJobs ? (
          <div className="job-portal-loading">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="job-portal-jobs-grid">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={{
                    ...job,
                    skills: Array.isArray(job.skills)
                      ? job.skills
                      : typeof job.skills === "string"
                      ? job.skills.split(",")
                      : [],
                  }}
                  onApply={() =>
                    alert(`Apply button clicked for ${job.title}`)
                  }
                />
              ))
            ) : (
              <div className="job-portal-no-results">
                <p className="job-portal-no-results-text">
                  No jobs found matching your search
                </p>
                <button onClick={resetFilters} className="job-portal-view-all-btn">
                  View All Jobs
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobPortal;



