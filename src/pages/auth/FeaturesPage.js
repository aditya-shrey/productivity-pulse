import React from 'react';
import { FaTasks, FaComments, FaUserShield, FaChartBar, FaEnvelope, FaBell } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { signInWithGoogle } from './Authentication';

const features = [
  {
    title: 'Real-time Task Management and Tracking',
    description: 'Manage and track tasks in real-time with our dynamic task management system. Assign tasks, set deadlines, and monitor progress to ensure your team stays on track.',
    icon: <FaTasks className="text-6xl text-primary" />,
  },
  {
    title: 'Team Chat and Collaboration',
    description: 'Communicate and collaborate with your team through our integrated chat system. Share updates, discuss ideas, and work together seamlessly to achieve your project goals.',
    icon: <FaComments className="text-6xl text-primary" />,
  },
  {
    title: 'Member Management with Role-based Permissions',
    description: 'Manage team members and assign roles with specific permissions. Control access to features and information to ensure the right people have the right tools.',
    icon: <FaUserShield className="text-6xl text-primary" />,
  },
  {
    title: 'Analytics and Reporting',
    description: 'Get insights and reports to monitor productivity and progress. Analyze data to identify trends, make informed decisions, and continuously improve your workflows.',
    icon: <FaChartBar className="text-6xl text-primary" />,
  },
  {
    title: 'Invitation Management with Email Notifications',
    description: 'Send and manage team invitations with automated email notifications. Easily invite new members, track pending invitations, and ensure everyone is on board.',
    icon: <FaEnvelope className="text-6xl text-primary" />,
  },
  {
    title: 'Custom Task Deadlines',
    description: 'Keep track of project deadlines and due dates. Get real-time updates on tasks, team activities, and project milestones to keep everyone in the loop.',
    icon: <FaBell className="text-6xl text-primary" />,
  },
];

function FeaturesPage() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      <Navbar signInWithGoogle={signInWithGoogle} />
      <div className="flex-grow pt-6 pb-10 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl w-full text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Explore Our Features</h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="border bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center"
              >
                <div className="mb-4">{feature.icon}</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{feature.title}</h2>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer className="py-4" />
    </div>
  );
}

export default FeaturesPage;