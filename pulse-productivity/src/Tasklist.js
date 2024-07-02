import React from 'react';


// TODO: integrate API call to fetch tasks
const TaskList = () => {
  const tasks = [
    {
      id: 1,
      name: 'Task 1',
      description: 'Description of Task 1',
      deadline: '2024-07-05',
      author: 'John Doe',
      notes: 'Additional notes for Task 1',
    },
    {
      id: 2,
      name: 'Task 2',
      description: 'Description of Task 2',
      deadline: '2024-07-10',
      author: 'Jane Smith',
      notes: 'Additional notes for Task 2',
    },
    {
      id: 2,
      name: 'Task 2',
      description: 'Description of Task 2',
      deadline: '2024-07-10',
      author: 'Jane Smith',
      notes: 'Additional notes for Task 2',
    },
  ];

  return (
    <div className="flex justify-center mt-8 gap-4 flex-wrap">
      {tasks.map(task => (
        <div key={task.id} className="bg-gray-100 text-black rounded-lg shadow-md p-4 w-72">
          <h3 className="text-lg text-black font-bold mb-2">{task.name}</h3>
          <p className="text-lg text-black mb-2"><strong>Description:</strong> {task.description}</p>
          <p className="text-lg text-black mb-2"><strong>Deadline:</strong> {task.deadline}</p>
          <p className="text-lg text-black mb-2"><strong>Author:</strong> {task.author}</p>
          <p className="text-lg text-black mb-2"><strong>Notes:</strong> {task.notes}</p>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
