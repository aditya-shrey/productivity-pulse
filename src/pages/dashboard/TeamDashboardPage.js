import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, collection, query, getDocs, addDoc, updateDoc, serverTimestamp, getDoc, arrayRemove, where } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';
import Navbar from '../../components/Navbar';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

function TeamDashboardPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [view, setView] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [chats, setChats] = useState([]);
  const [members, setMembers] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newChat, setNewChat] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [taskName, setTaskName] = useState("");
  const [userAssigned, setUserAssigned] = useState([]);
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDeleteDashboardConfirmation, setShowDeleteDashboardConfirmation] = useState(false);
  const [showDeleteMemberConfirmation, setShowDeleteMemberConfirmation] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const priorities = ["High", "Medium", "Low"];
  const statuses = ["Not Started", "Work in Progress", "Completed", "Backlog"];

  const fetchTasks = useCallback(async () => {
    const tasksCollectionRef = collection(firestore, 'teams', teamId, 'tasks');
    const q = query(tasksCollectionRef);
    const querySnapshot = await getDocs(q);
    const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTasks(tasksData);
  }, [teamId]);

  const fetchChats = useCallback(async () => {
    const chatsCollectionRef = collection(firestore, 'teams', teamId, 'chats');
    const q = query(chatsCollectionRef);
    const querySnapshot = await getDocs(q);
    const chatsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setChats(chatsData);
  }, [teamId]);

  const fetchTeam = useCallback(async () => {
    const teamDocRef = doc(firestore, 'teams', teamId);
    const teamDoc = await getDoc(teamDocRef);
    if (teamDoc.exists()) {
      setTeam(teamDoc.data());
      const membersData = await Promise.all(
        teamDoc.data()._members.map(async (memberId) => {
          const memberDoc = await getDoc(doc(firestore, 'users', memberId));
          return { id: memberId, ...memberDoc.data() };
        })
      );
      setMembers(membersData);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
    fetchTasks();
    fetchChats();
  }, [teamId, fetchTasks, fetchChats, fetchTeam]);

  const addTask = async () => {
    if (taskName.trim() === "" || newTask.trim() === "" || category.trim() === "") {
      alert("Task name, description, and category cannot be empty");
      return;
    }

    try {
      const task = {
        taskName,
        taskDescription: newTask,
        createdAt: serverTimestamp(),
        userCreated: auth.currentUser.uid,
        userAssigned,
        status: "Not Started",
        priority,
        category,
        dueDate: new Date(dueDate)
      };

      const tasksCollectionRef = collection(firestore, 'teams', teamId, 'tasks');
      await addDoc(tasksCollectionRef, task);
      setTaskName("");
      setNewTask("");
      setUserAssigned([]);
      setPriority("Medium");
      setCategory("");
      setDueDate("");
      fetchTasks();  // Refresh tasks
    } catch (error) {
      console.error("Error adding task: ", error);
      alert("Error adding task");
    }
  };

  const addChat = async () => {
    if (newChat.trim() === "") {
      alert("Chat message cannot be empty");
      return;
    }

    try {
      const chat = {
        text: newChat,
        createdAt: serverTimestamp(),
        userID: auth.currentUser.uid,
        userName: auth.currentUser.displayName, // Add user name to chat
        userPhotoURL: auth.currentUser.photoURL  // Add user photo URL to chat
      };

      const chatsCollectionRef = collection(firestore, 'teams', teamId, 'chats');
      await addDoc(chatsCollectionRef, chat);
      setNewChat("");
      fetchChats();  // Refresh chats
    } catch (error) {
      console.error("Error adding chat: ", error);
      alert("Error adding chat");
    }
  };

  const updateTask = async (taskId, update) => {
    try {
      const taskDocRef = doc(firestore, 'teams', teamId, 'tasks', taskId);
      await updateDoc(taskDocRef, update);
      fetchTasks();  // Refresh tasks
    } catch (error) {
      console.error("Error updating task: ", error);
      alert("Error updating task");
    }
  };

  const inviteUser = async () => {
    if (inviteEmail.trim() === "") {
      alert("Email cannot be empty");
      return;
    }

    try {
      // Find the user by email
      const usersCollectionRef = collection(firestore, 'users');
      const q = query(usersCollectionRef, where('_email', '==', inviteEmail));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("User not found");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      // Add invitation to the user's invitations subcollection
      const invitationsCollectionRef = collection(firestore, 'users', userId, 'invitations');
      await addDoc(invitationsCollectionRef, {
        teamId,
        teamName: team._name,
        invitedAt: serverTimestamp(),
        status: 'pending'
      });

      alert("User invited successfully");
      setInviteEmail("");
    } catch (error) {
      console.error("Error inviting user: ", error);
      alert("Error inviting user");
    }
  };

  const confirmRemoveUser = (userId) => {
    setMemberToDelete(userId);
    setShowDeleteMemberConfirmation(true);
  };

  const removeUser = async () => {
    if (auth.currentUser.uid !== team._admin) {
      alert("Only the admin can remove members.");
      return;
    }

    if (memberToDelete === team._admin) {
      alert("The admin cannot remove themselves.");
      return;
    }

    try {
      const teamDocRef = doc(firestore, 'teams', teamId);
      await updateDoc(teamDocRef, {
        _members: arrayRemove(memberToDelete)
      });

      alert("User removed successfully");
      setMembers(members.filter(member => member.id !== memberToDelete));
    } catch (error) {
      console.error("Error removing user: ", error);
      alert("Error removing user");
    }
  };

  const confirmDeleteDashboard = () => {
    setShowDeleteDashboardConfirmation(true);
  };

  const deleteDashboard = async () => {
    if (auth.currentUser.uid !== team._admin) {
      alert("Only the admin can delete the dashboard.");
      return;
    }

    try {
      const teamDocRef = doc(firestore, 'teams', teamId);
      await updateDoc(teamDocRef, {
        _deleted: true
      });

      alert("Dashboard deleted successfully");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error deleting dashboard: ", error);
      alert("Error deleting dashboard");
    }
  };

  const handleDeleteDashboardConfirmation = (confirm) => {
    setShowDeleteDashboardConfirmation(false);
    if (confirm) {
      deleteDashboard();
    }
  };

  const handleDeleteMemberConfirmation = (confirm) => {
    setShowDeleteMemberConfirmation(false);
    if (confirm) {
      removeUser();
    }
  };

  const generateUserTaskData = () => {
    const userTaskData = members.map(member => {
      const userTasks = tasks.filter(task => task.userAssigned.includes(member.id));
      const taskStatusCounts = statuses.reduce((acc, status) => {
        acc[status] = userTasks.filter(task => task.status === status).length;
        return acc;
      }, {});

      return {
        id: member.id,
        name: member._name,
        ...taskStatusCounts
      };
    });

    return userTaskData;
  };

  const generateTaskCompletionData = () => {
    const taskCompletionData = members.map(member => {
      const userTasks = tasks.filter(task => task.userAssigned.includes(member.id) && task.status === 'Completed');
      const completionDates = userTasks.map(task => task.createdAt.toDate());

      return {
        id: member.id,
        name: member._name,
        dates: completionDates
      };
    });

    return taskCompletionData;
  };

  const generateCategoryData = () => {
    const categoryCounts = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(categoryCounts),
      data: Object.values(categoryCounts)
    };
  };

  const generateProjectTimelineData = () => {
    const projectData = tasks.map(task => ({
      id: task.id,
      name: task.taskName,
      start: task.createdAt.toDate(),
      end: task.dueDate ? task.dueDate.toDate() : new Date()
    }));

    return projectData;
  };

  if (!team) {
    return <div>Loading team...</div>;
  }

  const userTaskData = generateUserTaskData();
  const taskCompletionData = generateTaskCompletionData();
  const categoryData = generateCategoryData();
  const projectTimelineData = generateProjectTimelineData();

  return (
    <div>
      <Navbar />
      <center>
        <h1>{team._name} Dashboard</h1>
        <button onClick={() => setView('tasks')}>Tasks</button>
        <button onClick={() => setView('chats')}>Chats</button>
        <button onClick={() => setView('members')}>Members</button>
        <button onClick={() => setView('analytics')}>Team Analytics</button>
        {auth.currentUser.uid === team._admin && (
          <button onClick={confirmDeleteDashboard}>Delete Dashboard</button>
        )}

        {view === 'tasks' && (
          <div>
            <h2>Tasks</h2>
            {tasks.map(task => (
              <div key={task.id} className="p-4 border-b border-gray-200">
                <p><strong>Name:</strong> {task.taskName}</p>
                <p><strong>Description:</strong> {task.taskDescription}</p>
                <p><strong>Assigned to:</strong> {task.userAssigned ? task.userAssigned.join(', ') : 'None'}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Category:</strong> {task.category}</p>
                <p><strong>Due Date:</strong> {task.dueDate ? task.dueDate.toDate().toString() : 'None'}</p>
                <p><strong>Created At:</strong> {task.createdAt.toDate().toString()}</p>
                <select
                  value={task.status}
                  onChange={(e) => updateTask(task.id, { status: e.target.value })}
                  className="border p-2"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            ))}
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task Name"
              className="border p-2"
            />
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Task Description"
              className="border p-2"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="Due Date"
              className="border p-2"
            />
            <select multiple value={userAssigned} onChange={(e) => setUserAssigned(Array.from(e.target.selectedOptions, option => option.value))}>
              {members.map(member => (
                <option key={member.id} value={member.id}>{member._name}</option>
              ))}
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {priorities.map(pri => (
                <option key={pri} value={pri}>{pri}</option>
              ))}
            </select>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="border p-2"
            />
            <button onClick={addTask} className="ml-2 p-2 bg-blue-500 text-white">Add Task</button>
          </div>
        )}

        {view === 'chats' && (
          <div>
            <h2>Chats</h2>
            {chats.map(chat => (
              <div key={chat.id} className="p-4 border-b border-gray-200 flex items-center">
                {chat.userPhotoURL && (
                  <img src={chat.userPhotoURL} alt={chat.userName} className="w-8 h-8 rounded-full mr-2" />
                )}
                <p><strong>{chat.userName}:</strong> {chat.text}</p>
              </div>
            ))}
            <input
              type="text"
              value={newChat}
              onChange={(e) => setNewChat(e.target.value)}
              placeholder="New Chat"
              className="border p-2"
            />
            <button onClick={addChat} className="ml-2 p-2 bg-blue-500 text-white">Send</button>
          </div>
        )}

        {view === 'members' && (
          <div>
            <h2>Members</h2>
            {members.map(member => (
              <div key={member.id}>
                <p>{member._name} ({member._email})</p>
                {auth.currentUser.uid === team._admin && member.id !== team._admin && (
                  <button onClick={() => confirmRemoveUser(member.id)}>Remove</button>
                )}
              </div>
            ))}
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Invite by Email"
              className="border p-2"
            />
            <button onClick={inviteUser} className="ml-2 p-2 bg-blue-500 text-white">Invite</button>
          </div>
        )}

        {view === 'analytics' && (
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
                    backgroundColor: status === "Completed" ? "green" : status === "Work in Progress" ? "blue" : status === "Not Started" ? "red" : "gray",
                  }))
                }}
                options={{ responsive: true }}
              />
            </div>
            <div>
              <h3>Tasks Completed Over Time</h3>
              {taskCompletionData.map(user => (
                <div key={user.id}>
                  <h4>{user.name}</h4>
                  <Line
                    data={{
                      labels: user.dates.map(date => date.toDateString()),
                      datasets: [{
                        label: 'Tasks Completed',
                        data: user.dates.map(() => 1),
                        borderColor: 'blue',
                        fill: false,
                      }]
                    }}
                    options={{ responsive: true }}
                  />
                </div>
              ))}
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
        )}
      </center>
      {showDeleteDashboardConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded">
            <h2>Are you sure you want to delete the dashboard?</h2>
            <button
              onClick={() => handleDeleteDashboardConfirmation(true)}
              className="mr-4 p-2 bg-red-500 text-white"
            >
              Yes
            </button>
            <button
              onClick={() => handleDeleteDashboardConfirmation(false)}
              className="p-2 bg-gray-300"
            >
              No
            </button>
          </div>
        </div>
      )}
      {showDeleteMemberConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded">
            <h2>Are you sure you want to remove this member?</h2>
            <button
              onClick={() => handleDeleteMemberConfirmation(true)}
              className="mr-4 p-2 bg-red-500 text-white"
            >
              Yes
            </button>
            <button
              onClick={() => handleDeleteMemberConfirmation(false)}
              className="p-2 bg-gray-300"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamDashboardPage;
