import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useJobs } from '../JobContext';
import { Heart, Share2, Bookmark, MapPin, Clock, DollarSign, Users, Calendar, Star, Building } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const mockJobDetails = {
  1: {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    posted: '2024-01-15',
    description: `We are seeking a talented Senior React Developer to join our dynamic team. You will be responsible for developing and maintaining high-quality web applications using React and related technologies.

Key Responsibilities:
• Develop user-facing features using React.js
• Build reusable components and front-end libraries
• Translate designs and wireframes into high-quality code
• Optimize components for maximum performance
• Collaborate with team members and stakeholders`,
    requirements: [
      '5+ years of experience with React.js',
      'Strong proficiency in JavaScript, HTML, CSS',
      'Experience with Redux or similar state management',
      'Familiarity with RESTful APIs',
      'Knowledge of modern build tools (Webpack, Babel)',
      'Experience with Git version control'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Flexible work arrangements',
      '401(k) with company matching',
      'Professional development budget',
      'Unlimited PTO'
    ],
    skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'CSS', 'HTML'],
    companyInfo: {
      size: '500-1000 employees',
      industry: 'Technology',
      founded: '2015',
      website: 'https://techcorp.com'
    }
  }
};

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getJobById, updateJobViews, applyToJob } = useJobs();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null
  });
  const [saved, setSaved] = useState(false);
  const [skillMatch, setSkillMatch] = useState(85);
  const [similarJobs] = useState([
    { id: 2, title: 'Frontend Developer', company: 'StartupXYZ', salary: '$90k-110k', match: 78 },
    { id: 3, title: 'Full Stack Engineer', company: 'WebCorp', salary: '$100k-130k', match: 82 }
  ]);

  useEffect(() => {
    // Check posted jobs first, then fallback to mock data
    setTimeout(() => {
      const postedJob = getJobById(id);
      let jobData;
      
      if (postedJob) {
        // Convert posted job format to display format
        jobData = {
          ...postedJob,
          requirements: postedJob.requirements ? postedJob.requirements.split('\n').filter(r => r.trim()) : [],
          benefits: postedJob.benefits ? postedJob.benefits.split('\n').filter(b => b.trim()) : [],
          skills: postedJob.skills ? postedJob.skills.split(',').map(s => s.trim()) : [],
          companyInfo: {
            size: '100-500 employees',
            industry: 'Technology',
            founded: '2020',
            website: `https://${postedJob.company.toLowerCase().replace(/\s+/g, '')}.com`
          }
        };
      } else {
        jobData = mockJobDetails[id] || {
          id,
          title: 'Job Not Found',
          company: 'Unknown',
          description: 'This job posting is no longer available.'
        };
      }
      
      setJob(jobData);
      setLoading(false);
      
      // Track job view
      if (jobData && jobData.id) {
        updateJobViews(jobData.id);
      }
    }, 1000);
  }, [id, getJobById, updateJobViews]);

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowApplicationForm(true);
  };

  const submitApplication = (e) => {
    e.preventDefault();
    
    const appData = {
      applicantName: user?.email || 'Anonymous',
      applicantEmail: user?.email || '',
      coverLetter: applicationData.coverLetter,
      resume: applicationData.resume?.name || 'resume.pdf'
    };
    
    applyToJob(job.id, appData);
    setApplied(true);
    setShowApplicationForm(false);
    alert(`Application submitted for ${job.title}!`);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = () => {
    navigator.share ? navigator.share({
      title: job.title,
      text: `Check out this job at ${job.company}`,
      url: window.location.href
    }) : navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!job || job.title === 'Job Not Found') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">This job posting is no longer available.</p>
          <button 
            onClick={() => navigate('/find-jobs')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Other Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Jobs
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-xl text-gray-600 mt-2">{job.company}</p>
              <div className="flex items-center gap-4 mt-3 text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                <span className="flex items-center gap-1"><Building size={16} /> {job.type}</span>
                <span className="flex items-center gap-1"><DollarSign size={16} /> {job.salary}</span>
              </div>
              
              {/* Skill Match */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Your Skill Match</span>
                  <span className="text-lg font-bold text-blue-600">{skillMatch}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: `${skillMatch}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={handleSave} className={`p-2 rounded-lg border ${saved ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
                </button>
                <button onClick={handleShare} className="p-2 rounded-lg border bg-gray-50 text-gray-600 border-gray-200">
                  <Share2 size={20} />
                </button>
                <button className="p-2 rounded-lg border bg-gray-50 text-gray-600 border-gray-200">
                  <Bookmark size={20} />
                </button>
              </div>
              
              {applied ? (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Star size={16} /> Application Submitted
                </div>
              ) : (
                <button 
                  onClick={handleApply}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
                >
                  Apply Now
                </button>
              )}
              
              <div className="mt-3 text-sm text-gray-500">
                <p className="flex items-center gap-1"><Calendar size={14} /> Posted: {job.posted}</p>
                <p className="flex items-center gap-1"><Users size={14} /> {job.applicants || 23} applicants</p>
                <p className="flex items-center gap-1"><Clock size={14} /> 5 days left</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose text-gray-700 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {job.skills && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info */}
            {job.companyInfo && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-3">About {job.company}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Industry:</strong> {job.companyInfo.industry}</p>
                  <p><strong>Size:</strong> {job.companyInfo.size}</p>
                  <p><strong>Founded:</strong> {job.companyInfo.founded}</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="text-yellow-400" size={16} fill="currentColor" />
                    <span className="font-semibold">4.2</span>
                    <span className="text-sm text-gray-500">(127 reviews)</span>
                  </div>
                  <button className="text-blue-600 text-sm hover:underline">View company profile</button>
                </div>
              </div>
            )}
            
            {/* Similar Jobs */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-3">Similar Jobs</h3>
              <div className="space-y-3">
                {similarJobs.map((job) => (
                  <div key={job.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium text-sm">{job.title}</h4>
                    <p className="text-xs text-gray-600">{job.company}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-green-600">{job.salary}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{job.match}% match</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Apply for {job.title}</h3>
            <form onSubmit={submitApplication}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us why you're interested in this position..."
                  required
                />
                <div className="mt-2 text-xs text-gray-500">
                  💡 Tip: Mention specific skills that match the job requirements
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setApplicationData({...applicationData, resume: e.target.files[0]})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <div className="mt-2 text-xs text-gray-500">
                  📄 Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </div>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-600">I agree to share my profile with {job.company}</span>
                </label>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Submit Application
                </button>
              </div>
              
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">Your application will be reviewed within 2-3 business days</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;