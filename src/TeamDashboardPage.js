import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, collection, query, getDocs, addDoc, updateDoc, serverTimestamp, getDoc, arrayRemove, where } from 'firebase/firestore';
import { auth, firestore } from './firebase';
import Navbar from './Navbar';

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
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const priorities = ["High", "Medium", "Low"];

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

  const fetchCategories = useCallback(async () => {
    const categoriesCollectionRef = collection(firestore, 'teams', teamId, 'categories');
    const q = query(categoriesCollectionRef);
    const querySnapshot = await getDocs(q);
    const categoriesData = querySnapshot.docs.map(doc => doc.data().name);
    setCategories(categoriesData);
  }, [teamId]);

  useEffect(() => {
    const fetchTeam = async () => {
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
    };

    fetchTeam();
    fetchTasks();
    fetchChats();
    fetchCategories();
  }, [teamId, fetchTasks, fetchChats, fetchCategories]);

  const addTask = async () => {
    if (taskName.trim() === "" || newTask.trim() === "") {
      alert("Task name and description cannot be empty");
      return;
    }

    try {
      const task = {
        taskName,
        taskDescription: newTask,
        createdAt: serverTimestamp(),
        userCreated: auth.currentUser.uid,
        userAssigned,
        completeBool: false,
        priority,
        category
      };

      const tasksCollectionRef = collection(firestore, 'teams', teamId, 'tasks');
      await addDoc(tasksCollectionRef, task);
      setTaskName("");
      setNewTask("");
      setUserAssigned([]);
      setPriority("Medium");
      setCategory("");
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
        userName: auth.currentUser.displayName  // Add user name to chat
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

  const removeUser = async (userId) => {
    if (auth.currentUser.uid !== team._admin) {
      alert("Only the admin can remove members.");
      return;
    }

    if (userId === team._admin) {
      alert("The admin cannot remove themselves.");
      return;
    }

    try {
      const teamDocRef = doc(firestore, 'teams', teamId);
      await updateDoc(teamDocRef, {
        _members: arrayRemove(userId)
      });

      alert("User removed successfully");
      setMembers(members.filter(member => member.id !== userId));
    } catch (error) {
      console.error("Error removing user: ", error);
      alert("Error removing user");
    }
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

  const addNewCategory = async () => {
    if (newCategory.trim() === "") {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const category = {
        name: newCategory,
        createdAt: serverTimestamp()
      };

      const categoriesCollectionRef = collection(firestore, 'teams', teamId, 'categories');
      await addDoc(categoriesCollectionRef, category);
      setCategory(newCategory);
      setNewCategory("");
      fetchCategories();  // Refresh categories
    } catch (error) {
      console.error("Error adding category: ", error);
      alert("Error adding category");
    }
  };

  const addNewPriority = (event) => {
    if (newPriority.trim() === "") {
      alert("Priority cannot be empty");
      return;
    }

    priorities.push(newPriority);
    setPriority(newPriority);
    setNewPriority("");
  };

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
        {auth.currentUser.uid === team._admin && (
          <button onClick={deleteDashboard}>Delete Dashboard</button>
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
                <p><strong>Created At:</strong> {task.createdAt.toDate().toString()}</p>
                <button onClick={() => updateTask(task.id, { completeBool: !task.completeBool })}>
                  {task.completeBool ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
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
            <select multiple value={userAssigned} onChange={(e) => setUserAssigned(Array.from(e.target.selectedOptions, option => option.value))}>
              {members.map(member => (
                <option key={member.id} value={member.id}>{member._name}</option>
              ))}
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {priorities.map(pri => (
                <option key={pri} value={pri}>{pri}</option>
              ))}
              <option value="newPriority">Add New Priority</option>
            </select>
            {priority === "newPriority" && (
              <div>
                <input
                  type="text"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  placeholder="New Priority"
                  className="border p-2"
                />
                <button onClick={addNewPriority} className="ml-2 p-2 bg-blue-500 text-white">Add Priority</button>
              </div>
            )}
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="newCategory">Add New Category</option>
            </select>
            {category === "newCategory" && (
              <div>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New Category"
                  className="border p-2"
                />
                <button onClick={addNewCategory} className="ml-2 p-2 bg-blue-500 text-white">Add Category</button>
              </div>
            )}
            <button onClick={addTask} className="ml-2 p-2 bg-blue-500 text-white">Add Task</button>
          </div>
        )}

        {view === 'chats' && (
          <div>
            <h2>Chats</h2>
            {chats.map(chat => (
              <div key={chat.id} className="p-4 border-b border-gray-200">
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
                  <button onClick={() => removeUser(member.id)}>Remove</button>
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
      </center>
    </div>
  );
}

export default TeamDashboardPage;
