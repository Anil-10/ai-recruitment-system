import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Components.css';

function JobCard({ job, onApply }) {
  const navigate = useNavigate();

  const handleApply = () => {
    if (onApply) onApply(job);
    else alert(`Applied to ${job.title} at ${job.company}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
        <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
          {job.type || 'Full-time'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-2">{job.company} • {job.location}</p>
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.map((skill, idx) => (
          <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-900">{job.salary}</span>
        <div className="space-x-2">
          <button 
            onClick={() => navigate(`/job-details/${job.id}`)}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            View Details
          </button>
          <button 
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;