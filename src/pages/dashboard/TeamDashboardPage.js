import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, collection, query, getDocs, addDoc, updateDoc, serverTimestamp, getDoc, arrayRemove, where } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';
import Navbar from '../../components/Navbar';
import Tasks from './Tasks';
import Chats from './Chats';
import Members from './Members';
import Analytics from './Analytics';
import TaskArchive from './TaskArchive';

function TeamDashboardPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [view, setView] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [chats, setChats] = useState([]);
  const [members, setMembers] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [newTask, setNewTask] = useState("");
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [userAssigned, setUserAssigned] = useState([]);
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [newChat, setNewChat] = useState("");
  const [showDeleteDashboardConfirmation, setShowDeleteDashboardConfirmation] = useState(false);
  const [showDeleteMemberConfirmation, setShowDeleteMemberConfirmation] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const priorities = ["High", "Medium", "Low"];
  const statuses = ["Backlog", "In Progress", "Completed"];

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

      // Create a dictionary of user IDs to usernames
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
        status: "Backlog",
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

  const updateTask = async (taskId, update) => {
    try {
      const taskDocRef = doc(firestore, 'teams', teamId, 'tasks', taskId);
      if (update.status === "Completed") {
        update.completedAt = serverTimestamp();  // Add completion timestamp
      }
      await updateDoc(taskDocRef, update);
      fetchTasks();  // Refresh tasks
    } catch (error) {
      console.error("Error updating task: ", error);
      alert("Error updating task");
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
    return tasks.filter(task => task.status === status);
  };

  const userTaskData = generateUserTaskData();
  const teamTaskCompletionData = generateTeamTaskCompletionData();
  const categoryData = generateCategoryData();
  const projectTimelineData = generateProjectTimelineData();

  if (!team) {
    return <div>Loading team...</div>;
  }

  return (
    <div>
      <Navbar />
      <center>
        <h1>{team._name} Dashboard</h1>
        <button onClick={() => setView('tasks')}>Tasks</button>
        <button onClick={() => setView('chats')}>Chats</button>
        <button onClick={() => setView('members')}>Members</button>
        <button onClick={() => setView('analytics')}>Team Analytics</button>
        <button onClick={() => setView('archive')}>Task Archive</button>
        {auth.currentUser.uid === team._admin && (
          <button onClick={confirmDeleteDashboard}>Delete Dashboard</button>
        )}

        {view === 'tasks' && (
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
            statuses={statuses}
            priorities={priorities}
          />
        )}

        {view === 'chats' && (
          <Chats
            chats={chats}
            newChat={newChat}
            setNewChat={setNewChat}
            addChat={addChat}
          />
        )}

        {view === 'members' && (
          <Members
            members={members}
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            inviteUser={inviteUser}
            confirmRemoveUser={confirmRemoveUser}
            team={team}
            auth={auth}
          />
        )}

        {view === 'analytics' && (
          <Analytics
            userTaskData={userTaskData}
            teamTaskCompletionData={teamTaskCompletionData}
            categoryData={categoryData}
            projectTimelineData={projectTimelineData}
            statuses={statuses}
          />
        )}

        {view === 'archive' && (
          <TaskArchive
            tasks={filterTasks('Completed')}
            members={members}
            usernames={usernames}
            updateTask={updateTask}
            statuses={statuses}
          />
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
