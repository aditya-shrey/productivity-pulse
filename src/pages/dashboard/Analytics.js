import React from 'react';
import PropTypes from 'prop-types';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaTasks, FaCalendarAlt, FaTags, FaProjectDiagram } from 'react-icons/fa'; 
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const TimelineItem = ({ project, index, total }) => (
  <div className="relative mb-8">
    <div className={`absolute w-2 h-full bg-gray-300 ${index < total - 1 ? 'border-r-2 border-gray-300' : ''} left-1/2 transform -translate-x-1/2`}></div>
    <div className="flex items-center">
      <div className="bg-blue-500 text-white p-2 rounded-full h-8 w-8 flex items-center justify-center">
        {index + 1}
      </div>
      <div className="ml-4">
        <p className="font-semibold">{project.name}</p>
        <p className="text-sm text-gray-600">Start: {new Date(project.start).toDateString()}</p>
        <p className="text-sm text-gray-600">End: {new Date(project.end).toDateString()}</p>
      </div>
    </div>
  </div>
  
);

TimelineItem.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};


const Analytics = ({ userTaskData, teamTaskCompletionData, categoryData, projectTimelineData, statuses }) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaProjectDiagram className="text-gray-500 mr-2" /> Team Analytics
      </h2>
      <div className="mb-8">
        <h3 className="text-xl pt-6 font-semibold mb-4 flex items-center">
          <FaTasks className="text-gray-500 mr-2" /> Tasks Overview
        </h3>
        <div className="w-full max-w-4xl mx-auto">
          <Bar
            data={{
              labels: userTaskData.map(data => data.name),
              datasets: statuses.map(status => ({
                label: status,
                data: userTaskData.map(data => data[status]),
                backgroundColor: status === 'Completed' ? '#4CAF50' : status === 'In Progress' ? '#2196F3' : status === 'Not Started' ? '#F44336' : '#9E9E9E',
              }))
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += context.parsed.y;
                      }
                      return label;
                    }
                  }
                }
              }
            }}
            height={300} 
          />
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl pt-12 font-semibold mb-4 flex items-center">
          <FaCalendarAlt className="text-gray-500 mr-2" /> Tasks Completed Over Time
        </h3>
        <div className="w-full max-w-4xl mx-auto">
          <Line
            data={{
              labels: teamTaskCompletionData.labels,
              datasets: [{
                label: 'Tasks Completed',
                data: teamTaskCompletionData.data,
                borderColor: '#2196F3',
                fill: false,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += context.parsed.y;
                      }
                      return label;
                    }
                  }
                }
              }
            }}
            height={300} 
          />
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl pt-12 font-semibold mb-4 flex items-center">
          <FaTags className="text-gray-500 mr-2" /> Project Categories
        </h3>
        <div className="w-full max-w-4xl mx-auto">
          <Pie
            data={{
              labels: categoryData.labels,
              datasets: [{
                data: categoryData.data,
                backgroundColor: ['#F44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF5722'],
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      let label = context.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed !== null) {
                        label += context.parsed;
                      }
                      return label;
                    }
                  }
                }
              }
            }}
            height={300} 
          />
        </div>
      </div>
      <div>
        <h3 className="text-xl pt-12 font-semibold mb-4 flex items-center">
          <FaProjectDiagram className="text-gray-500 mr-2" /> Project Timeline
        </h3>
        <div className="relative">
          {projectTimelineData.map((project, index) => (
            <TimelineItem
              key={project.id}
              project={project}
              index={index}
              total={projectTimelineData.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

Analytics.propTypes = {
  userTaskData: PropTypes.arrayOf(PropTypes.object).isRequired,
  teamTaskCompletionData: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.number)
  }).isRequired,
  categoryData: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.number)
  }).isRequired,
  projectTimelineData: PropTypes.arrayOf(PropTypes.object).isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired
  
};

export default Analytics;
