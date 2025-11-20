// backend/routes/externalJobs.js
const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const router = express.Router();

const REMOTIVE_URL = "https://remotive.com/api/remote-jobs";
const ARBEITNOW_URL = "https://www.arbeitnow.com/api/job-board-api";
const ADZUNA_COUNTRY = "in";
const ADZUNA_URL = `https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/1`;

router.get("/", async (req, res) => {
  try {
    const adzunaId = process.env.ADZUNA_APP_ID;
    const adzunaKey = process.env.ADZUNA_APP_KEY;

    const remotive = fetch(REMOTIVE_URL).then((r) => r.json()).catch(() => ({ jobs: [] }));
    const arbeitnow = fetch(ARBEITNOW_URL).then((r) => r.json()).catch(() => ({ data: [] }));

    let adzuna = Promise.resolve({ results: [] });
    if (adzunaId && adzunaKey) {
      const url =
        `${ADZUNA_URL}?app_id=${encodeURIComponent(adzunaId)}` +
        `&app_key=${encodeURIComponent(adzunaKey)}` +
        `&results_per_page=50&where=India`;
      adzuna = fetch(url).then((r) => r.json()).catch(() => ({ results: [] }));
    }

    const [remotiveData, arbeitData, adzunaData] = await Promise.all([remotive, arbeitnow, adzuna]);

    res.json({
      remotive: remotiveData,
      arbeitnow: arbeitData,
      adzuna: adzunaData,
    });
  } catch (err) {
    console.error("External job fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch external jobs" });
  }
});

module.exports = router;
