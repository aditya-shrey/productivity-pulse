import React, { useState } from 'react';
import {
  FaEdit,
  FaTrashAlt,
  FaAngleDown,
  FaAngleUp,
  FaUser,
  FaCalendarAlt,
  FaClipboardList,
  FaTag,
  FaExclamationCircle,
} from 'react-icons/fa';
import PropTypes from 'prop-types';

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
  moveToDeletedTasks, 
  statuses,
  priorities,
}) => {
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEditTask = (task) => {
    setTaskName(task.taskName);
    setNewTask(task.taskDescription);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().substr(0, 10) : '');
    setUserAssigned(task.userAssigned || []);
    setPriority(task.priority);
    setCategory(task.category);
    setEditingTask(task.id);
    setShowModal(true);
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
    setShowModal(false);
  };

  const toggleExpandTask = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  return (
    <div className="relative p-8 text-black min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Tasks</h2>
      <button
        onClick={() => setShowModal(true)}
        className="py-2 px-12 mb-6 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition duration-150"
      >
        + New Task
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-lg shadow-md w-2/3">
            <h3 className="text-xl font-semibold mb-4">{editingTask ? 'Edit Task' : 'Add Task'}</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Name</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Task Name"
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Description</label>
                <textarea
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Task Description"
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="Due Date"
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned to</label>
                <select
                  value={userAssigned.length ? userAssigned : ''}
                  onChange={(e) => setUserAssigned(Array.from(e.target.selectedOptions, (option) => option.value))}
                  className="border p-2 rounded w-full"
                >
                  <option disabled value="">-- Select a Teammate --</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>{member._name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  {priorities.map((pri) => (
                    <option key={pri} value={pri}>{pri}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="py-2 px-4 bg-gray-500 text-white rounded shadow hover:bg-gray-600 transition duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  className="py-2 px-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-150"
                >
                  {editingTask ? 'Save Task' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 bg-gray-50 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{task.taskName}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaUser className="mr-1" />
                  <span>{task.userAssigned ? task.userAssigned.map(userId => usernames[userId] || userId).join(', ') : 'None'}</span>
                  <FaCalendarAlt className="ml-4 mr-1" />
                  <span>{task.dueDate ? new Date(task.dueDate).toDateString() : 'None'}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={task.status}
                  onChange={(e) => updateTask(task.id, { status: e.target.value })}
                  className="border p-1 rounded bg-gray-50 text-black pr-2 pl-2"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button
                  onClick={() => toggleExpandTask(task.id)}
                  className="text-blue-400 hover:text-blue-600 transition duration-150 pl-12"
                >
                  {expandedTask === task.id ? <FaAngleUp /> : <FaAngleDown />}
                </button>
              </div>
            </div>
            {expandedTask === task.id && (
              <div className="mt-4 text-sm text-gray-700">
                <p className="flex items-center"><FaClipboardList className="mr-2" /> <strong>Description:&nbsp;</strong> {task.taskDescription}</p>
                <p className="flex items-center mt-2"><FaTag className="mr-2" /> <strong>Category:&nbsp;</strong>{task.category}</p>
                <p className="flex items-center mt-2"><FaExclamationCircle className="mr-2" /> <strong>Priority:&nbsp;</strong> {task.priority}</p>
                <p className="flex items-center mt-2"><FaCalendarAlt className="mr-2" /> <strong>Created At:&nbsp;</strong> {new Date(task.createdAt).toDateString()}</p>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="flex items-center py-2 px-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-150"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => moveToDeletedTasks(task.id, task)}
                    className="flex items-center py-2 px-4 bg-red-500 text-white rounded shadow hover:bg-red-600 transition duration-150"
                  >
                    <FaTrashAlt className="mr-2" /> Delete
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

Tasks.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  usernames: PropTypes.object.isRequired,
  taskName: PropTypes.string.isRequired,
  setTaskName: PropTypes.func.isRequired,
  newTask: PropTypes.string.isRequired,
  setNewTask: PropTypes.func.isRequired,
  dueDate: PropTypes.string.isRequired,
  setDueDate: PropTypes.func.isRequired,
  userAssigned: PropTypes.array.isRequired,
  setUserAssigned: PropTypes.func.isRequired,
  priority: PropTypes.string.isRequired,
  setPriority: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
  addTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  moveToDeletedTasks: PropTypes.func.isRequired, 
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  priorities: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Tasks;
