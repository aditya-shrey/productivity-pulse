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
    <div>
      <h2>Team Analytics</h2>
      <div>
        <h3>Tasks Overview</h3>
        <Bar
          data={{
            labels: userTaskData.map(data => data.name),
            datasets: statuses.map(status => ({
              label: status,
              data: userTaskData.map(data => data[status]),
              backgroundColor: status === 'Completed' ? 'green' : status === 'Work in Progress' ? 'blue' : status === 'Not Started' ? 'red' : 'gray',
            }))
          }}
          options={{ responsive: true }}
        />
      </div>
      <div>
        <h3>Tasks Completed Over Time</h3>
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
      <div>
        <h3>Project Categories</h3>
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
        <h3>Project Timeline</h3>
        <ul>
          {projectTimelineData.map(project => (
            <li key={project.id}>
              <p>{project.name}</p>
              <p>Start: {project.start.toDateString()}</p>
              <p>End: {project.end.toDateString()}</p>
            </li>
          ))}
        </ul>
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
