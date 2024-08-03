import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, collection, query, getDocs, addDoc, updateDoc, serverTimestamp, getDoc, arrayRemove } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';
import { FaCog, FaHome, FaTasks, FaComments, FaUsers, FaChartLine, FaArchive } from 'react-icons/fa';
import { FaTrashAlt, FaTimes } from 'react-icons/fa';
import Select from 'react-select';

import Tasks from './Tasks';
import Chats from './Chats';
import Members from './Members';
import Analytics from './Analytics';
import TaskArchive from './TaskArchive';
import { useInvites } from './Invites';

function TeamDashboardPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [view, setView] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [chats, setChats] = useState([]);
  const [members, setMembers] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [newTask, setNewTask] = useState('');
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [userAssigned, setUserAssigned] = useState([]);
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');  
  const [newChat, setNewChat] = useState('');
  const [showDeleteDashboardConfirmation, setShowDeleteDashboardConfirmation] = useState(false);
  const [showDeleteMemberConfirmation, setShowDeleteMemberConfirmation] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const priorities = ['High', 'Medium', 'Low'];
  const statuses = ['Backlog', 'In Progress', 'Completed'];
  const [selectedMember, setSelectedMember] = useState(null);

  const handleMemberChange = (selectedOption) => {
    setSelectedMember(selectedOption);
  };

  const handleRemoveMember = () => {
    if (selectedMember) {
      confirmRemoveUser(selectedMember.value);
    }
  };

  const { inviteUser } = useInvites(teamId);

  const fetchTasks = useCallback(async () => {
    const tasksCollectionRef = collection(firestore, 'teams', teamId, 'tasks');
    const q = query(tasksCollectionRef);
    const querySnapshot = await getDocs(q);
    const tasksData = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate ? data.dueDate.toDate() : null,
        createdAt: data.createdAt.toDate(),
        completedAt: data.completedAt ? data.completedAt.toDate() : null,
      };
    });
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

      const usernames = membersData.reduce((acc, member) => {
        acc[member.id] = member._name;
        return acc;
      }, {});
      setUsernames(usernames);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
    fetchTasks();
    fetchChats();
  }, [teamId, fetchTasks, fetchChats, fetchTeam]);

  const addTask = async () => {
    if (taskName.trim() === '' || newTask.trim() === '' || category.trim() === '') {
      alert('Task name, description, and category cannot be empty');
      return;
    }

    try {
      const task = {
        taskName,
        taskDescription: newTask,
        createdAt: serverTimestamp(),
        userCreated: auth.currentUser.uid,
        userAssigned,
        status: 'Backlog',
        priority,
        category,
        dueDate: new Date(dueDate)
      };

      const tasksCollectionRef = collection(firestore, 'teams', teamId, 'tasks');
      await addDoc(tasksCollectionRef, task);
      setTaskName('');
      setNewTask('');
      setUserAssigned([]);
      setPriority('Medium');
      setCategory('');
      setDueDate('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task: ', error);
      alert('Error adding task');
    }
  };

  const updateTask = async (taskId, update) => {
    try {
      const taskDocRef = doc(firestore, 'teams', teamId, 'tasks', taskId);
      if (update.status === 'Completed') {
        update.completedAt = serverTimestamp();
      }
      await updateDoc(taskDocRef, update);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task: ', error);
      alert('Error updating task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskDocRef = doc(firestore, 'teams', teamId, 'tasks', taskId);
      await updateDoc(taskDocRef, {
        _deleted: true
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task: ', error);
      alert('Error deleting task');
    }
  };

  const addChat = async () => {
    if (newChat.trim() === '') {
      alert('Chat message cannot be empty');
      return;
    }

    try {
      const chat = {
        text: newChat,
        createdAt: serverTimestamp(),
        userID: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
        userPhotoURL: auth.currentUser.photoURL
      };

      const chatsCollectionRef = collection(firestore, 'teams', teamId, 'chats');
      await addDoc(chatsCollectionRef, chat);
      setNewChat('');
      fetchChats();
    } catch (error) {
      console.error('Error adding chat: ', error);
      alert('Error adding chat');
    }
  };

  const confirmRemoveUser = (userId) => {
    setMemberToDelete(userId);
    setShowDeleteMemberConfirmation(true);
  };

  const removeUser = async () => {
    if (auth.currentUser.uid !== team._admin) {
      alert('Only the admin can remove members.');
      return;
    }

    if (memberToDelete === team._admin) {
      alert('The admin cannot remove themselves.');
      return;
    }

    try {
      const teamDocRef = doc(firestore, 'teams', teamId);
      await updateDoc(teamDocRef, {
        _members: arrayRemove(memberToDelete)
      });

      alert('User removed successfully');
      setMembers(members.filter(member => member.id !== memberToDelete));
    } catch (error) {
      console.error('Error removing user: ', error);
      alert('Error removing user');
    }
  };

  const confirmDeleteDashboard = () => {
    setShowDeleteDashboardConfirmation(true);
  };

  const deleteDashboard = async () => {
    if (auth.currentUser.uid !== team._admin) {
      alert('Only the admin can delete the dashboard.');
      return;
    }

    try {
      const teamDocRef = doc(firestore, 'teams', teamId);
      await updateDoc(teamDocRef, {
        _deleted: true
      });

      alert('Dashboard deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting dashboard: ', error);
      alert('Error deleting dashboard');
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

  const generateTeamTaskCompletionData = () => {
    const completedTasks = tasks.filter(task => task.status === 'Completed' && task.completedAt);
    const completionDates = completedTasks.map(task => task.completedAt);

    const dateCounts = completionDates.reduce((acc, date) => {
      const dateString = date.toDateString();
      acc[dateString] = (acc[dateString] || 0) + 1;
      return acc;
    }, {});

    const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b));

    return {
      labels: sortedDates,
      data: sortedDates.map(date => dateCounts[date])
    };
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
      start: task.createdAt,
      end: task.dueDate || new Date()
    }));

    return projectData;
  };

  const filterTasks = (status) => {
    return tasks.filter(task => task.status === status && !task._deleted);
  };

  const userTaskData = generateUserTaskData();
  const teamTaskCompletionData = generateTeamTaskCompletionData();
  const categoryData = generateCategoryData();
  const projectTimelineData = generateProjectTimelineData();

  if (!team) {
    return <div>Loading team...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-row h-screen overflow-hidden">
        <div className="w-64 bg-gray-900 text-white flex flex-col h-full shadow-lg">
          <div className="flex items-center justify-between p-4 pb-6 pt-4 bg-gray-800">
            <h1 className="text-2xl font-bold">{team._name}</h1>
          </div>
          <button
            className={`flex items-center px-4 py-2 text-left hover:bg-gray-700 ${view === 'tasks' && 'bg-gray-700'}`}
            onClick={() => setView('tasks')}
          >
            <FaTasks className="mr-2" />
    Tasks
          </button>
          <button
            className={`flex items-center px-4 py-2 text-left hover:bg-gray-700 ${view === 'chats' && 'bg-gray-700'}`}
            onClick={() => setView('chats')}
          >
            <FaComments className="mr-2" />
    Chats
          </button>
          <button
            className={`flex items-center px-4 py-2 text-left hover:bg-gray-700 ${view === 'analytics' && 'bg-gray-700'}`}
            onClick={() => setView('analytics')}
          >
            <FaChartLine className="mr-2" />
    Team Analytics
          </button>
          <button
            className={`flex items-center px-4 py-2 text-left hover:bg-gray-700 ${view === 'members' && 'bg-gray-700'}`}
            onClick={() => setView('members')}
          >
            <FaUsers className="mr-2" />
    Members
          </button>
          <button
            className={`flex items-center px-4 py-2 text-left hover:bg-gray-700 ${view === 'archive' && 'bg-gray-700'}`}
            onClick={() => setView('archive')}
          >
            <FaArchive className="mr-2" />
    Task Archive
          </button>
          <div className="mt-auto flex items-center justify-between p-4 bg-gray-800">
            <button
              className="text-2xl text-white hover:text-gray-400"
              onClick={() => setShowSettingsModal(true)}
            >
              <FaCog />
            </button>
            <span className="text-white text-sm italic">Pulse Productivity</span>
            <button
              className="text-2xl text-white hover:text-gray-400"
              onClick={() => navigate('/dashboard')}
            >
              <FaHome />
            </button>
          </div>

        </div>

        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="w-full bg-white p-8 rounded-lg shadow-md h-full">
              {view === 'tasks' && (
                <div className="h-full overflow-y-auto">
                  <Tasks
                    tasks={filterTasks('Backlog').concat(filterTasks('In Progress')).concat(filterTasks('Not Started'))}
                    members={members}
                    usernames={usernames}
                    taskName={taskName}
                    setTaskName={setTaskName}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    dueDate={dueDate}
                    setDueDate={setDueDate}
                    userAssigned={userAssigned}
                    setUserAssigned={setUserAssigned}
                    priority={priority}
                    setPriority={setPriority}
                    category={category}
                    setCategory={setCategory}
                    addTask={addTask}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                    statuses={statuses}
                    priorities={priorities}
                  />
                </div>
              )}

              {view === 'chats' && (
                <div className="h-full overflow-y-auto">
                  <Chats
                    chats={chats}
                    newChat={newChat}
                    setNewChat={setNewChat}
                    addChat={addChat}
                  />
                </div>
              )}

              {view === 'members' && (
                <div className="h-full overflow-y-auto">
                  <Members
                    usernames={usernames.photoURL}
                    members={members}
                    inviteEmail={inviteEmail}
                    setInviteEmail={setInviteEmail}
                    inviteUser={(email) => {
                      console.log('Inviting user with email:', email);
                      inviteUser(email, team);
                    }}
                    confirmRemoveUser={confirmRemoveUser}
                    team={team}
                    auth={auth}
                  />
                </div>
              )}

              {view === 'analytics' && (
                <div className="h-full overflow-y-auto">
                  <Analytics
                    userTaskData={userTaskData}
                    teamTaskCompletionData={teamTaskCompletionData}
                    categoryData={categoryData}
                    projectTimelineData={projectTimelineData}
                    statuses={statuses}
                  />
                </div>
              )}

              {view === 'archive' && (
                <div className="h-full overflow-y-auto">
                  <TaskArchive
                    tasks={filterTasks('Completed')}
                    members={members}
                    usernames={usernames}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                    statuses={statuses}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSettingsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="mb-4 text-lg font-semibold flex items-center">
              <FaCog className="mr-2" />
              Settings
            </h2>

            <div className="mb-4">
              <h3 className="text-md font-semibold">Remove Member</h3>
              <Select
                options={members.map(member => ({
                  value: member.id,
                  label: member._name
                }))}
                onChange={handleMemberChange}
                placeholder="Select a member to remove"
                className="basic-single mb-4"
                isDisabled={auth.currentUser.uid !== team._admin}  
              />
              <button
                className={`w-full px-4 py-2 rounded flex items-center justify-center ${
                  auth.currentUser.uid === team._admin ? 'text-white bg-red-500 hover:bg-red-600' : 'text-gray-500 bg-gray-300 cursor-not-allowed'
                }`}
                onClick={auth.currentUser.uid === team._admin ? handleRemoveMember : null}
                disabled={auth.currentUser.uid !== team._admin}  
              >
                <FaTrashAlt className="mr-2" />
                {auth.currentUser.uid === team._admin ? 'Remove Member' : 'Admins Only'}
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-md font-semibold">Other Settings</h3>
              <button
                className={`w-full px-4 py-2 rounded flex items-center justify-center mb-2 ${
                  auth.currentUser.uid === team._admin ? 'text-white bg-red-500 hover:bg-red-600' : 'text-gray-500 bg-gray-300 cursor-not-allowed'
                }`}
                onClick={auth.currentUser.uid === team._admin ? confirmDeleteDashboard : null}
                disabled={auth.currentUser.uid !== team._admin}  
              >
                <FaTrashAlt className="mr-2" />
                {auth.currentUser.uid === team._admin ? 'Delete Dashboard' : 'Admins Only'}
              </button>
              <button
                className="w-full px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded flex items-center justify-center"
                onClick={() => setShowSettingsModal(false)}
              >
                <FaTimes className="mr-2" />
                Close
              </button>
            </div>

          </div>
        </div>
      )}

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
