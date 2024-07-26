import React, { useState } from 'react';

const TaskArchive = ({
  tasks,
  members,
  usernames,
  updateTask,
  deleteTask,
  statuses,
}) => {
  const [editingTask, setEditingTask] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [userAssigned, setUserAssigned] = useState([]);
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("");

  const handleEditTask = (task) => {
    setTaskName(task.taskName);
    setNewTask(task.taskDescription);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().substr(0, 10) : "");
    setUserAssigned(task.userAssigned || []);
    setPriority(task.priority);
    setCategory(task.category);
    setEditingTask(task.id);
  };

  const handleSaveTask = async () => {
    if (editingTask) {
      await updateTask(editingTask, {
        taskName,
        taskDescription: newTask,
        dueDate: new Date(dueDate),
        userAssigned,
        priority,
        category,
      });
      setEditingTask(null);
    }
  };

  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => a.dueDate - b.dueDate);

  return (
    <div>
      <h2>Task Archive</h2>
      {editingTask && (
        <div className="mb-4">
          <h3>Edit Task</h3>
          <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="Task Name" className="border p-2" />
          <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Task Description" className="border p-2" />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Due Date" className="border p-2" />
          <select multiple value={userAssigned} onChange={(e) => setUserAssigned(Array.from(e.target.selectedOptions, (option) => option.value))}>
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member._name}</option>
            ))}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            {["High", "Medium", "Low"].map((pri) => (
              <option key={pri} value={pri}>{pri}</option>
            ))}
          </select>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="border p-2" />
          <button onClick={handleSaveTask} className="ml-2 p-2 bg-blue-500 text-white">Save Task</button>
        </div>
      )}

      {sortedTasks.map((task) => (
        <div key={task.id} className="p-4 border-b border-gray-200">
          <p><strong>Name:</strong> {task.taskName}</p>
          <p><strong>Description:</strong> {task.taskDescription}</p>
          <p><strong>Assigned to:</strong> {task.userAssigned ? task.userAssigned.map(userId => usernames[userId] || userId).join(', ') : 'None'}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Category:</strong> {task.category}</p>
          <p><strong>Due Date:</strong> {task.dueDate ? task.dueDate.toDateString() : 'None'}</p>
          <p><strong>Created At:</strong> {task.createdAt.toDateString()}</p>
          <p><strong>Completed At:</strong>{task.completedAt ? task.completedAt.toDateString() : 'Not Completed'}</p>
          <select value={task.status} onChange={(e) => updateTask(task.id, { status: e.target.value })} className="border p-2">
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button onClick={() => handleEditTask(task)} className="ml-2 p-2 bg-blue-500 text-white">Edit</button>
          <button onClick={() => deleteTask(task.id)} className="ml-2 p-2 bg-red-500 text-white">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TaskArchive;
