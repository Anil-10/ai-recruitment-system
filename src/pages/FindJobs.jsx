// frontend/src/pages/FindJobs.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExternalAvailableJobs from "../components/ExternalAvailableJobs";
import { useJobs } from "../JobContext";
import DashboardNav from "../components/DashboardNav";
// import "./../styles/find-jobs.css"; // keep or create this file if you want custom styles

/**
 * FindJobs page
 * - Adds filter controls (title/keywords, location, type)
 * - Passes filters to ExternalAvailableJobs component
 * - Filters manual jobs client-side
 */

export default function FindJobs() {
  const { jobs: manualJobs = [], applyToJob } = useJobs();
  const navigate = useNavigate();

  // Filter states
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("All Types");

  const filters = { query, location, type };

  const clearFilters = () => {
    setQuery("");
    setLocation("");
    setType("All Types");
  };

  // Filter manual jobs (client-side)
  const filteredManualJobs = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    const loc = (location || "").trim().toLowerCase();
    const t = (type || "All Types");

    return (manualJobs || []).filter((job) => {
      // normalize fields
      const title = (job.title || job.job_title || "").toString().toLowerCase();
      const company = (job.company || job.company_name || "").toString().toLowerCase();
      const description = (job.description || job.details || job.content || "").toString().toLowerCase();
      const tags = Array.isArray(job.tags) ? job.tags.join(" ").toLowerCase() : ((job.skills || "") + "").toLowerCase();
      const jobLoc = (job.location || job.city || job.country || "").toString().toLowerCase();

      // query match
      if (q) {
        const hay = `${title} ${company} ${description} ${tags}`;
        if (!hay.includes(q)) return false;
      }

      // location
      if (loc) {
        if (!jobLoc.includes(loc)) return false;
      }

      // type - try some heuristics for manual jobs
      if (t && t !== "All Types") {
        const jt = inferType(job);
        if (jt !== t) return false;
      }

      return true;
    });
  }, [manualJobs, query, location, type]);

  function inferType(job) {
    if (!job) return "N/A";
    const keys = [job.job_type, job.type, job.contract_type, job.employment_type, job.contract, job.work_type];
    for (const k of keys) {
      if (!k) continue;
      const v = String(k).toLowerCase();
      if (v.includes("intern")) return "Internship";
      if (v.includes("full")) return "Full-time";
      if (v.includes("part")) return "Part-time";
      if (v.includes("contract")) return "Contract";
      if (v.includes("remote")) return "Remote";
      if (v.includes("freel")) return "Freelance";
    }
    const tags = job.tags || (job.skills ? (typeof job.skills === "string" ? job.skills.split(",") : job.skills) : []);
    if (Array.isArray(tags)) {
      const tstr = tags.join(" ").toLowerCase();
      if (tstr.includes("intern")) return "Internship";
      if (tstr.includes("remote")) return "Remote";
    }
    if (String(job.location || "").toLowerCase().includes("remote")) return "Remote";
    return "N/A";
  }

  // Quick apply for manual jobs
  const handleQuickApply = (job) => {
    if (applyToJob && typeof applyToJob === "function") {
      const applicationData = {
        applicantName: "Anonymous",
        applicantEmail: "anonymous@example.com",
        coverLetter: `Applying for ${job.title}`,
        resume: "resume.pdf"
      };
      applyToJob(job.id || job.job_id || job.slug, applicationData);
      navigate(`/job-details/${job.id || job.job_id || job.slug}`);
      return;
    }
    const applyUrl = job.apply_url || job.url || job.company_url || job.redirect_url || "#";
    if (applyUrl && applyUrl !== "#") {
      window.open(applyUrl, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/job-details/${job.id || job.job_id || job.slug}`);
    }
  };

  return (
    <div className="find-jobs-page">
      <DashboardNav />

      <div className="page-inner" style={{ padding: "18px 28px" }}>
        <h1 style={{ margin: "12px 0 18px 0", color: "#0f172a" }}>Find Jobs</h1>

        {/* Filter bar */}
        <div className="filter-bar" style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 18,
          background: "#ffffff",
          padding: 14,
          borderRadius: 10,
          boxShadow: "0 6px 18px rgba(15,23,42,0.04)"
        }}>
          <input
            type="text"
            placeholder="Job title or keywords"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #e6eef8"
            }}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: 220,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #e6eef8"
            }}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: 160,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #e6eef8"
            }}
          >
            <option>All Types</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
            <option>Remote</option>
            <option>Freelance</option>
          </select>

          <button
            onClick={clearFilters}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #e6eef8",
              background: "#fff",
              cursor: "pointer"
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* External API jobs (filtered by same filters via prop) */}
        <section style={{ marginBottom: 32 }}>
          <ExternalAvailableJobs maxItems={12} loadIncrement={6} filters={filters} />
        </section>

        {/* Manually posted jobs */}
        <section style={{ marginTop: 8 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12
          }}>
            <h2 style={{ margin: 0 }}>Manually posted jobs</h2>
            <div style={{ color: "#64748b", fontSize: 14 }}>
              {filteredManualJobs.length} job{filteredManualJobs.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {(!filteredManualJobs || filteredManualJobs.length === 0) ? (
            <div style={{
              padding: 18,
              borderRadius: 10,
              background: "#fff",
              boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
              color: "#475569"
            }}>
              No manually posted jobs found.
            </div>
          ) : (
            <div className="manual-jobs-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 18
            }}>
              {filteredManualJobs.map((job) => {
                const id = job.id || job.job_id || job.slug;
                const title = job.title || job.job_title || job.position || "Untitled";
                const company = job.company || job.company_name || job.posted_by || "Company";
                const locationStr = job.location || job.city || job.country || "Location not provided";
                const salary = job.salary || job.compensation || null;
                const tags = Array.isArray(job.tags) ? job.tags : (job.skills ? (typeof job.skills === "string" ? job.skills.split(",") : job.skills) : []);
                const description = job.description || job.details || job.content || "";

                return (
                  <div key={id} className="job-card manual-job-card" style={{
                    background: "#fff",
                    borderRadius: 10,
                    padding: 16,
                    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
                    border: "1px solid rgba(99,102,241,0.04)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ margin: 0 }}>{title}</h3>
                        <div style={{ color: "#64748b", marginTop: 6 }}>{company} • {locationStr}</div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{
                          fontSize: 12,
                          padding: "6px 10px",
                          borderRadius: 14,
                          background: "#eef2ff",
                          color: "#0f172a",
                          border: "1px solid #c7d2fe"
                        }}>
                          Internal
                        </div>
                      </div>
                    </div>

                    {salary ? (
                      <div style={{ marginTop: 12, fontWeight: 700, color: "#059669" }}>{salary}</div>
                    ) : null}

                    {description ? (
                      <div style={{ marginTop: 8, color: "#475569", minHeight: 48 }}>
                        {description.length > 220 ? description.slice(0, 220) + "..." : description}
                      </div>
                    ) : null}

                    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {tags && tags.slice(0, 6).map((t, i) => (
                        <span key={i} className="tag-pill" style={{
                          background: "#f1f5f9",
                          color: "#0f172a",
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontSize: 13
                        }}>{t}</span>
                      ))}
                    </div>

                    <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "center" }}>
                      <button
                        className="view-details-btn"
                        onClick={() => navigate(`/job-details/${id}`)}
                        style={{
                          borderRadius: 8,
                          padding: "10px 16px",
                          background: "#2563eb",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        View Details
                      </button>

                      <button
                        className="apply-now-btn"
                        onClick={() => handleQuickApply(job)}
                        style={{
                          borderRadius: 8,
                          padding: "10px 16px",
                          background: "#10b981",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
