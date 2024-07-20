import React from 'react';
import teamsIcon from './assets/team.webp'; 
import tasksIcon from './assets/tasks.png'; 
import manageIcon from './assets/manage.png'; 

const Banner = () => {
  return (
    <div className="bg-blue-100 border shadow-xxl py-4 h-40 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center space-x-12 w-full">
        <div className="flex items-center px-4 space-x-3">
          <img src={teamsIcon} alt="Multiple Teams" className="h-8" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Multiple Teams</h2>
            <p className="text-sm text-gray-600">Create and manage multiple teams for different projects</p>
          </div>
        </div>
        <div className="flex items-center px-4 space-x-3">
          <img src={tasksIcon} alt="Task Management" className="h-8 w-8" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Task Management</h2>
            <p className="text-sm text-gray-600">Assign and manage tasks for each team member</p>
          </div>
        </div>
        <div className="flex items-center px-4 space-x-3">
          <img src={manageIcon} alt="Productivity Tools" className="h-8 w-8" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Productivity Tools</h2>
            <p className="text-sm text-gray-600">Tools to enhance your team's productivity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
