import React, { useState } from 'react';

const Tasks = ({
  tasks,
  members,
  usernames,
  taskName,
  setTaskName,
  newTask,
  setNewTask,
  dueDate,
  setDueDate,
  userAssigned,
  setUserAssigned,
  priority,
  setPriority,
  category,
  setCategory,
  addTask,
  updateTask,
  deleteTask,
  statuses,
  priorities,
}) => {
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);

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
    } else {
      addTask();
    }
  };

  const toggleExpandTask = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6">Tasks</h2>
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">{editingTask ? "Edit Task" : "Add Task"}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task Description"
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Due Date"
            className="border p-2 rounded"
          />
          <select
            multiple
            value={userAssigned}
            onChange={(e) => setUserAssigned(Array.from(e.target.selectedOptions, (option) => option.value))}
            className="border p-2 rounded"
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member._name}</option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 rounded"
          >
            {priorities.map((pri) => (
              <option key={pri} value={pri}>{pri}</option>
            ))}
          </select>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="border p-2 rounded"
          />
          <button
            onClick={handleSaveTask}
            className="mt-2 py-2 px-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-150"
          >
            {editingTask ? "Save Task" : "Add Task"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div key={task.id} className="p-6 bg-gray-50 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{task.taskName}</p>
                <p className="text-gray-500">{task.priority}</p>
              </div>
              <button
                onClick={() => toggleExpandTask(task.id)}
                className="text-blue-500 hover:text-blue-700 transition duration-150"
              >
                {expandedTask === task.id ? 'Less' : 'More'}
              </button>
            </div>
            {expandedTask === task.id && (
              <div className="mt-4">
                <p><strong>Description:</strong> {task.taskDescription}</p>
                <p><strong>Assigned to:</strong> {task.userAssigned ? task.userAssigned.map(userId => usernames[userId] || userId).join(', ') : 'None'}</p>
                <p><strong>Category:</strong> {task.category}</p>
                <p><strong>Due Date:</strong> {task.dueDate ? task.dueDate.toDateString() : 'None'}</p>
                <p><strong>Created At:</strong> {task.createdAt.toDateString()}</p>
                <select
                  value={task.status}
                  onChange={(e) => updateTask(task.id, { status: e.target.value })}
                  className="border p-2 rounded mb-4"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="py-2 px-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="py-2 px-4 bg-red-500 text-white rounded shadow hover:bg-red-600 transition duration-150"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
