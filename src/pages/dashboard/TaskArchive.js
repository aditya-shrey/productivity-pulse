import React from 'react';

const TaskArchive = ({
  tasks,
  members,
  usernames,
  updateTask,
  statuses,
}) => {
  return (
    <div>
      <h2>Task Archive</h2>
      {tasks.map((task) => (
        <div key={task.id} className="p-4 border-b border-gray-200">
          <p>
            <strong>Name:</strong> {task.taskName}
          </p>
          <p>
            <strong>Description:</strong> {task.taskDescription}
          </p>
          <p>
            <strong>Assigned to:</strong>{' '}
            {task.userAssigned
              ? task.userAssigned.map((userId) => usernames[userId] || userId).join(', ')
              : 'None'}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Category:</strong> {task.category}
          </p>
          <p>
            <strong>Due Date:</strong> {task.dueDate ? task.dueDate.toDate().toString() : 'None'}
          </p>
          <p>
            <strong>Created At:</strong> {task.createdAt.toDate().toString()}
          </p>
          <select
            value={task.status}
            onChange={(e) => updateTask(task.id, { status: e.target.value })}
            className="border p-2"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default TaskArchive;
