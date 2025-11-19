// frontend/src/components/ExternalAvailableJobs.jsx
import React, { useEffect, useState } from "react";
import "./../styles/external-available-jobs.css";

/**
 * ExternalAvailableJobs
 * - Fetches aggregated jobs from backend proxy /api/external-jobs
 * - Accepts `filters` prop { query, location, type } to filter results client-side
 * - Renders external API jobs only (doesn't render manual jobs)
 * - All previous features preserved: source badge, modal, quick apply, load more
 */

export default function ExternalAvailableJobs({
  maxItems = 12,
  loadIncrement = 6,
  filters = { query: "", location: "", type: "All Types" }
}) {
  const [apiJobs, setApiJobs] = useState([]); // combined external sources
  const [loadingApi, setLoadingApi] = useState(true);
  const [errApi, setErrApi] = useState(null);
  const [selected, setSelected] = useState(null);
  const [visibleApi, setVisibleApi] = useState(maxItems);

  useEffect(() => {
    let mounted = true;

    async function fetchExternal() {
      setLoadingApi(true);
      setErrApi(null);
      try {
        const res = await fetch("/api/external-jobs");
        if (!res.ok) throw new Error(`Proxy status ${res.status}`);
        const data = await res.json();

        const combined = [];

        // Normalize Remotive
        if (data?.remotive?.jobs && Array.isArray(data.remotive.jobs)) {
          data.remotive.jobs.forEach((j) =>
            combined.push({
              id: j.id || j.job_id || j.slug || j.url,
              title: j.title || "Untitled",
              company_name: j.company_name || j.company || "Company",
              location: j.candidate_required_location || j.location || "Remote",
              description: j.description || j.description_preview || "",
              url: j.url || j.job_apply_url || "",
              salary: j.salary || j.salary_from || null,
              tags: j.tags || (j.category ? [j.category] : []),
              date: j.publication_date || j.created_at || j.date || null,
              redirect_url: j.redirect_url || null,
              remote_url: j.remote_url || null,
              job_apply_url: j.job_apply_url || null,
              source: "Remotive",
              raw: j
            })
          );
        }

        // Normalize ArbeitNow
        if (data?.arbeitnow?.data && Array.isArray(data.arbeitnow.data)) {
          data.arbeitnow.data.forEach((j) =>
            combined.push({
              id: j.slug || j.id || j.url || `${j.title || j.position}-${j.company || ""}`,
              title: j.title || j.position || "Untitled",
              company_name: j.company || j.company_name || "Company",
              location: j.location || j.remote || "Remote",
              description: j.description || j.content || "",
              url: j.url || j.remote_url || "",
              salary: j.salary || null,
              tags: j.tags || [],
              date: j.created_at || j.date || null,
              redirect_url: j.redirect_url || null,
              remote_url: j.remote_url || null,
              job_apply_url: j.job_apply_url || null,
              source: "ArbeitNow",
              raw: j
            })
          );
        }

        // Normalize Adzuna
        if (data?.adzuna?.results && Array.isArray(data.adzuna.results)) {
          data.adzuna.results.forEach((j) =>
            combined.push({
              id: j.id || j.redirect_url || `${j.title}-${j.company?.display_name}`,
              title: j.title || "Untitled",
              company_name: (j.company && j.company.display_name) || j.company?.name || "Company",
              location: (j.location && j.location.display_name) || j.location || "India",
              description: j.description || j.snippet || "",
              url: j.redirect_url || j.redirect || j.location?.url || "",
              salary:
                (j.salary_min || j.salary_max)
                  ? `${j.salary_min || ""}${j.salary_min && j.salary_max ? "-" : ""}${j.salary_max || ""}`
                  : null,
              tags: j.category?.label ? [j.category.label] : [],
              date: j.created || j.created_at || j.created_date || null,
              redirect_url: j.redirect_url || j.redirect || null,
              remote_url: j.remote_url || null,
              job_apply_url: j.job_apply_url || null,
              source: "Adzuna",
              raw: j
            })
          );
        }

        // Deduplicate & sort newest first
        const seen = new Set();
        const deduped = [];
        for (const item of combined) {
          const key =
            item.url && item.url !== ""
              ? item.url
              : `${(item.title || "").toLowerCase()}::${(item.company_name || "").toLowerCase()}`;
          if (!seen.has(key)) {
            seen.add(key);
            deduped.push(item);
          }
        }
        deduped.sort((a, b) => {
          const ta = a.date ? Date.parse(a.date) : 0;
          const tb = b.date ? Date.parse(b.date) : 0;
          return (tb || 0) - (ta || 0);
        });

        if (mounted) {
          setApiJobs(deduped);
          setLoadingApi(false);
        }
      } catch (err) {
        console.error("External jobs fetch error:", err);
        if (mounted) {
          setErrApi("Failed to load external jobs");
          setLoadingApi(false);
        }
      }
    }

    fetchExternal();
    return () => {
      mounted = false;
    };
  }, []);

  // ---------- Filtering ----------
  // filters: { query, location, type } - type string e.g. "All Types", "Full-time", "Internship", etc.
  const matchFilter = (job) => {
    const q = (filters.query || "").trim().toLowerCase();
    const loc = (filters.location || "").trim().toLowerCase();
    const type = (filters.type || "All Types").trim();

    // Query: match title / company / description / tags
    if (q) {
      const hay =
        `${job.title || ""} ${job.company_name || ""} ${job.description || ""} ${(job.tags || []).join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    // Location
    if (loc) {
      const jobLoc = (job.location || "").toLowerCase();
      if (!jobLoc.includes(loc)) return false;
    }

    // Type (uses heuristics)
    if (type && type !== "All Types") {
      const jt = inferType(job);
      if (jt !== type) return false;
    }

    return true;
  };

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
    const tags = job.tags || job.raw?.tags || [];
    if (Array.isArray(tags)) {
      const tstr = tags.join(" ").toLowerCase();
      if (tstr.includes("intern")) return "Internship";
      if (tstr.includes("remote")) return "Remote";
    }
    if (String(job.location || "").toLowerCase().includes("remote")) return "Remote";
    return "N/A";
  }

  function getApplyUrl(job) {
    if (!job) return "#";
    if (job.redirect_url) return job.redirect_url;
    if (job.redirect) return job.redirect;
    if (job.url) return job.url;
    if (job.job_apply_url) return job.job_apply_url;
    if (job.remote_url) return job.remote_url;
    if (job.apply_url) return job.apply_url;
    if (job.apply_link) return job.apply_link;
    if (job.company_website) return job.company_website;
    return "#";
  }

  function stripHtml(html) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  }

  function formatPosted(dateString) {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString || "Unknown";
      const diff = Date.now() - d.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 48) {
        if (hours < 1) return "just now";
        if (hours === 1) return "1 hour ago";
        return `${hours} hours ago`;
      }
      return d.toLocaleDateString();
    } catch {
      return dateString || "Unknown";
    }
  }

  // Apply filters to apiJobs when rendering
  const renderedApiJobs = apiJobs.filter(matchFilter);

  // render card
  function renderJobCard(job) {
    const id = job.id || job.job_id || job.slug || job.url || Math.random();
    const title = job.title || "Untitled";
    const company = job.company_name || "Company";
    const location = job.location || "Remote";
    const salary = job.salary || null;
    const tags = (job.tags && Array.isArray(job.tags)) ? job.tags : (job.raw?.tags || []);
    const posted = job.date || job.created_at || job.createdAt || null;
    const source = job.source || "External";

    return (
      <div className="eaj-card" key={id}>
        <div className="eaj-card-inner">
          <div className="eaj-top-row">
            <div className="eaj-title">{title}</div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div className="eaj-source-badge" title={`Source: ${source}`} style={{
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 12,
                background: "#eef2ff",
                color: "#1e293b",
                border: "1px solid #c7d2fe"
              }}>{source}</div>
            </div>
          </div>

          <div className="eaj-company">{company}</div>
          <div className="eaj-location">{location}</div>

          {salary ? <div className="eaj-salary">{salary}</div> : null}

          <div className="eaj-desc">{stripHtml(job.description || "").slice(0, 180)}{(job.description || "").length > 180 ? "..." : ""}</div>

          <div className="eaj-tags">
            {(tags || []).slice(0, 4).map((t, i) => (
              <span className="eaj-tag" key={i}>{t}</span>
            ))}
          </div>

          <div className="eaj-divider" />

          <div className="eaj-meta-row">
            {/* left blank for external jobs for alignment */}
            <div style={{ minHeight: 18 }}></div>
            <div style={{ minHeight: 18 }}></div>
          </div>

          <div className="eaj-actions">
            <button className="eaj-btn eaj-btn-primary" onClick={() => setSelected(job)}>View Details</button>

            <a
              className="eaj-btn eaj-btn-apply"
              href={getApplyUrl(job)}
              target="_blank"
              rel="noreferrer"
            >
              Quick Apply
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loadingApi) return <div className="eaj-loading">Loading external jobs…</div>;
  if (errApi) return <div className="eaj-error">{errApi}</div>;
  if (!renderedApiJobs.length) return <div className="eaj-empty">No external jobs available right now.</div>;

  return (
    <div className="eaj-container">
      <div className="eaj-grid">
        {renderedApiJobs.slice(0, visibleApi).map(job => renderJobCard(job))}
      </div>

      {visibleApi < renderedApiJobs.length && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button className="eaj-btn" onClick={() => setVisibleApi(v => v + loadIncrement)}>Load more external jobs</button>
        </div>
      )}

      {/* modal */}
      {selected && (
        <div className="eaj-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="eaj-modal" onClick={(e) => e.stopPropagation()}>
            <div className="eaj-modal-header">
              <h3 style={{ margin: 0 }}>{selected.title}</h3>
              <button className="eaj-modal-close" onClick={() => setSelected(null)}>×</button>
            </div>

            <div className="eaj-modal-body" style={{ maxHeight: "60vh", overflow: "auto", paddingTop: 8 }}>
              <div style={{ marginBottom: 12 }}>
                <strong>{selected.company_name || selected.company}</strong>
                {selected.location ? ` — ${selected.location}` : ""}
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                {selected.salary ? <div style={{ fontWeight: 600 }}>{selected.salary}</div> : null}
                {(selected.tags || []).slice(0, 6).map((t, i) => (
                  <span key={i} className="eaj-tag">{t}</span>
                ))}
                <div style={{ marginLeft: "auto", fontSize: 12, color: "#475569" }}>{selected.source ? selected.source : ""}</div>
              </div>

              <div className="eaj-modal-desc">
                {selected.description ? (
                  /<\/?[a-z][\s\S]*>/i.test(selected.description) ? (
                    <div dangerouslySetInnerHTML={{ __html: selected.description }} />
                  ) : (
                    <div>{selected.description}</div>
                  )
                ) : (
                  <div>No description available.</div>
                )}
              </div>
            </div>

            <div className="eaj-modal-actions">
              <a className="eaj-btn eaj-btn-apply" href={getApplyUrl(selected)} target="_blank" rel="noreferrer">Quick Apply</a>
              <button className="eaj-btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
