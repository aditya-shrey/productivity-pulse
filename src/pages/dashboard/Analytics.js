import React from 'react';
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

const Analytics = ({ userTaskData, teamTaskCompletionData, categoryData, projectTimelineData, statuses }) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6">Team Analytics</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Tasks Overview</h3>
        <Bar
          data={{
            labels: userTaskData.map(data => data.name),
            datasets: statuses.map(status => ({
              label: status,
              data: userTaskData.map(data => data[status]),
              backgroundColor: status === "Completed" ? "green" : status === "In Progress" ? "blue" : status === "Not Started" ? "red" : "gray",
            }))
          }}
          options={{ responsive: true }}
        />
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Tasks Completed Over Time</h3>
        <Line
          data={{
            labels: teamTaskCompletionData.labels,
            datasets: [{
              label: 'Tasks Completed',
              data: teamTaskCompletionData.data,
              borderColor: 'blue',
              fill: false,
            }]
          }}
          options={{ responsive: true }}
        />
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Project Categories</h3>
        <Pie
          data={{
            labels: categoryData.labels,
            datasets: [{
              data: categoryData.data,
              backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
            }]
          }}
          options={{ responsive: true }}
        />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Project Timeline</h3>
        <ul className="list-disc list-inside">
          {projectTimelineData.map(project => (
            <li key={project.id} className="mb-4">
              <p className="font-semibold">{project.name}</p>
              <p>Start: {new Date(project.start).toDateString()}</p>
              <p>End: {new Date(project.end).toDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
