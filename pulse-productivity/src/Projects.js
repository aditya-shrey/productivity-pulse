import React from 'react';
import './Projects.css';

const projects = [
  { name: 'Project Alpha', members: 5 },
  { name: 'Project Beta', members: 7 },
  { name: 'Project Gamma', members: 3 },
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-primary-dark dark:text-primary-dark mb-6">Welcome back! You look nice today.</h1>
      <p className="text-neutral-dark dark:text-primary-light mb-8">Choose a project below to get back to working with your team.</p>
      <div className="bg-white dark:bg-white shadow-lg rounded-lg w-full max-w-md border-4 border-black">
        <div className="p-4">
          {projects.map((project, index) => (
            <div key={index} className="flex items-center bg-primary-light pt-6 px-6 justify-between p-4 hover:bg-neutral-light dark:hover:bg-neutral-dark transition-colors duration-200 rounded-lg mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-dark text-white flex items-center justify-center rounded-full">
                  {project.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="text-sm text-neutral-dark dark:text-neutral-light">{project.members} members</p>
                </div>
              </div>
              <div>
                <button className="text-accent-dark hover:text-accent-light transition-colors duration-200">&rarr;</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <button className="bg-primary-dark border-4 border-black text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-accent-light transition-transform transform hover:scale-105">
          Create Another Project
        </button>
      </div>
      <div className="mt-6 text-sm text-neutral-dark dark:text-primary-light">
        Not seeing your project? <a href="#" className="text-accent-dark hover:text-primary-DEFAULT transition-colors duration-200">Try a different email</a>
      </div>
    </div>
  );
};

export default Projects;
