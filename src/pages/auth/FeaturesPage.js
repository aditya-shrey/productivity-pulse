import React from 'react';
import { FaTasks, FaComments, FaUserShield, FaChartBar, FaEnvelope } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Navbar/>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Features</h1>
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-md shadow-md">
            <div className="md:w-1/2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Real-time Task Management and Tracking</h2>
              <p className="text-gray-600">Manage and track tasks in real-time with our dynamic task management system. Assign tasks, set deadlines, and monitor progress to ensure your team stays on track.</p>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end mt-4 md:mt-0">
              <FaTasks className="text-6xl text-primary" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-md shadow-md">
            <div className="md:w-1/2 md:order-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Chat and Collaboration</h2>
              <p className="text-gray-600">Communicate and collaborate with your team through our integrated chat system. Share updates, discuss ideas, and work together seamlessly to achieve your project goals.</p>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-start mt-4 md:mt-0">
              <FaComments className="text-6xl text-primary" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-md shadow-md">
            <div className="md:w-1/2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Member Management with Role-based Permissions</h2>
              <p className="text-gray-600">Manage team members and assign roles with specific permissions. Control access to features and information to ensure the right people have the right tools.</p>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end mt-4 md:mt-0">
              <FaUserShield className="text-6xl text-primary" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-md shadow-md">
            <div className="md:w-1/2 md:order-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics and Reporting</h2>
              <p className="text-gray-600">Get insights and reports to monitor productivity and progress. Analyze data to identify trends, make informed decisions, and continuously improve your workflows.</p>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-start mt-4 md:mt-0">
              <FaChartBar className="text-6xl text-primary" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-md shadow-md">
            <div className="md:w-1/2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Invitation Management with Email Notifications</h2>
              <p className="text-gray-600">Send and manage team invitations with automated email notifications. Easily invite new members, track pending invitations, and ensure everyone is on board.</p>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end mt-4 md:mt-0">
              <FaEnvelope className="text-6xl text-primary" />
            </div>
          </div>
        </div>
      </div>
      <Footer className="py-4" />
    </div>
  );
};

export default FeaturesPage;
