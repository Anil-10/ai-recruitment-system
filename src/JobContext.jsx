import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "./supabaseClient";
import { useUser } from "./UserContext";

const JobContext = createContext();
export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const { user } = useUser();

  /******************************
   🔹 Fetch jobs from Supabase
  ******************************/
  const fetchJobs = async () => {
    setLoadingJobs(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error.message);
    } else {
      setJobs(data || []);
    }

    setLoadingJobs(false);
  };

  /*******************************************
   🔹 Recruiter post new job → Save to DB
  *******************************************/
  const addJob = async (job) => {
    if (!user?.id) {
      console.error("❌ Job submission failed — No authenticated recruiter");
      return { error: "User not authenticated" };
    }

    // Ensure Supabase compatible structure
    const jobData = {
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      skills: Array.isArray(job.skills)
        ? job.skills.join(",")
        : job.skills,
      experience: job.experience,
      education: job.education,
      department: job.department,
      remote: job.remote,
      recruiter_id: user.id,
      views: 0, // allowed field
    };

    const { data, error } = await supabase
      .from("jobs")
      .insert(jobData)
      .select();

    if (error) {
      console.error("❌ Supabase Insert Error:", error.message);
    } else {
      console.log("✅ Job Created:", data);
      fetchJobs(); // Refresh UI across app
    }

    return { data, error };
  };

  /*********************************
   🔹 Get job by ID
  *********************************/
  const getJobById = (id) => {
    return jobs.find((job) => job.id === parseInt(id));
  };

  /*********************************
   🔹 Update view count
  *********************************/
  const updateJobViews = async (id) => {
    const job = jobs.find((job) => job.id === id);
    if (!job) return;

    await supabase
      .from("jobs")
      .update({ views: (job.views || 0) + 1 })
      .eq("id", id);

    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <JobContext.Provider
      value={{
        jobs,
        addJob,
        getJobById,
        updateJobViews,
        fetchJobs,
        loadingJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};













// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { supabase } from "./supabaseClient";
// import { useUser } from "./UserContext";

// const JobContext = createContext();

// export const useJobs = () => {
//   const context = useContext(JobContext);
//   if (!context) {
//     throw new Error("useJobs must be used within a JobProvider");
//   }
//   return context;
// };

// export const JobProvider = ({ children }) => {
//   const [jobs, setJobs] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [loadingJobs, setLoadingJobs] = useState(false);

//   const { user } = useUser(); // Supabase auth user from context

//   // 🔹 Fetch jobs from Supabase DB
//   const fetchJobs = async () => {
//     setLoadingJobs(true);
//     const { data, error } = await supabase
//       .from("jobs")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (!error) {
//       setJobs(data || []);
//     } else {
//       console.error("Error fetching jobs:", error);
//     }
//     setLoadingJobs(false);
//   };

//   // 🔹 Create job in Supabase DB
//   const addJob = async (job) => {
//     if (!user || !user.id) {
//       console.error("No recruiter logged in");
//       return;
//     }

//     const jobData = {
//       title: job.title,
//       company: job.company,
//       location: job.location,
//       type: job.type,
//       salary: job.salary,
//       description: job.description,
//       requirements: job.requirements,
//       benefits: job.benefits,
//       skills: job.skills,
//       experience: job.experience,
//       education: job.education,
//       department: job.department,
//       remote: job.remote,
//       recruiter_id: user.id
// };


//     const { error } = await supabase.from("jobs").insert(jobData);
//     if (error) {
//       console.error("Failed to post job:", error.message);
//       throw error;
//     }

//     await fetchJobs(); // Refresh UI everywhere
//   };

//   // 🔹 Return job details from state
//   const getJobById = (id) => {
//     return jobs.find((job) => job.id === id);
//   };

//   // 🔹 Update view count in Supabase (optional)
//   const updateJobViews = async (id) => {
//     const job = jobs.find((job) => job.id === id);
//     if (!job) return;

//     await supabase
//       .from("jobs")
//       .update({ views: (job.views || 0) + 1 })
//       .eq("id", id);

//     fetchJobs();
//   };

//   // 🔹 Apply to job (Phase 2: Move apps to Supabase as we discussed)
//   const applyToJob = (jobId, applicationData) => {
//     const application = {
//       id: Date.now(),
//       jobId,
//       ...applicationData,
//       status: "pending",
//       appliedDate: new Date().toLocaleDateString(),
//     };

//     setApplications((prev) => [...prev, application]);

//     setJobs((prev) =>
//       prev.map((job) =>
//         job.id === jobId
//           ? { ...job, applicants: (job.applicants || 0) + 1 }
//           : job
//       )
//     );

//     return application;
//   };

//   const getApplicationsByJob = (jobId) => {
//     return applications.filter((app) => app.jobId === jobId);
//   };

//   useEffect(() => {
//     fetchJobs(); // initial load
//   }, []);

//   return (
//     <JobContext.Provider
//       value={{
//         jobs,
//         applications,
//         addJob,
//         getJobById,
//         updateJobViews,
//         applyToJob,
//         getApplicationsByJob,
//         loadingJobs,
//         fetchJobs,
//       }}
//     >
//       {children}
//     </JobContext.Provider>
//   );
// };
