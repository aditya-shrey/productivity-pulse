import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp, doc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../firebase/firebase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { signOut } from 'firebase/auth';

function DashboardPage() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [showInvitations, setShowInvitations] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [teamToInvite, setTeamToInvite] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const navigate = useNavigate();

  const fetchTeams = async () => {
    const q = query(collection(firestore, 'teams'), where('_members', 'array-contains', auth.currentUser.uid), where('_deleted', '==', false));
    const querySnapshot = await getDocs(q);
    const teamsData = await Promise.all(querySnapshot.docs.map(async (docSnapshot, index) => {
      const teamData = docSnapshot.data();
      const membersData = await Promise.all(
        teamData._members.map(async (memberId) => {
          const memberDocRef = doc(firestore, 'users', memberId);
          const memberDoc = await getDoc(memberDocRef);
          return { id: memberId, ...memberDoc.data() };
        })
      );
      return {
        id: docSnapshot.id,
        ...teamData,
        members: membersData,
        bgColor: getRandomPastelColor(),
        symbol: symbols[index % symbols.length]
      };
    }));
    setTeams(teamsData);
  };


    const fetchInvitations = async () => {
      const invitationsCollectionRef = collection(firestore, 'users', auth.currentUser.uid, 'invitations');
      const q = query(invitationsCollectionRef, where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const invitationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter out duplicates, keeping only the most recent invite for each team
      const uniqueInvitations = [];
      const teamIds = new Set();
      for (const invitation of invitationsData) {
        if (!teamIds.has(invitation.teamId)) {
          uniqueInvitations.push(invitation);
          teamIds.add(invitation.teamId);
        }
      }

      setInvitations(uniqueInvitations);
    };


  useEffect(() => {
    fetchTeams();
    fetchInvitations();
  }, []);

  const getRandomPastelColor = () => {
    const r = Math.floor((Math.random() * 127) + 127);
    const g = Math.floor((Math.random() * 127) + 127);
    const b = Math.floor((Math.random() * 127) + 127);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const symbols = ['⭐', '🌟', '🍀', '🌸', '🌼', '🍄', '🌿', '🌈', '🎈', '🍁', '🌻', '🍇', '🍉', '🌺', '🍒', '🍎', '🌲', '🌵', '🌳', '🌷'];

  const createTeam = async () => {
    if (teamName.trim() === "") {
      alert("Team name cannot be empty");
      return;
    }

    try {
      const newTeam = {
        _name: teamName,
        _desc: "",
        _admin: auth.currentUser.uid,
        _members: [auth.currentUser.uid],
        _createdAt: serverTimestamp(),
        _deleted: false
      };

      await addDoc(collection(firestore, 'teams'), newTeam);
      setTeamName("");
      alert("Team created successfully");
      fetchTeams(); 
    } catch (error) {
      console.error("Error creating team: ", error);
      alert("Error creating team");
    }
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/signin');
    }).catch((error) => {
      console.error("Error signing out: ", error);
      alert("Error signing out");
    });
  };

  const inviteUser = async (teamId) => {
    if (inviteEmail.trim() === "") {
      alert("Email cannot be empty");
      return;
    }

    try {
      const usersCollectionRef = collection(firestore, 'users');
      const q = query(usersCollectionRef, where('_email', '==', inviteEmail));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("User not found");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      const invitationsCollectionRef = collection(firestore, 'users', userId, 'invitations');
      await addDoc(invitationsCollectionRef, {
        teamId,
        teamName: teams.find(team => team.id === teamId)._name,
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

  const confirmDeleteTeam = (teamId) => {
    setTeamToDelete(teamId);
    setShowDeleteConfirmation(true);
  };

  const deleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      const teamDocRef = doc(firestore, 'teams', teamToDelete);
      await updateDoc(teamDocRef, {
        _deleted: true
      });

      alert("Team deleted successfully");
      setTeams(teams.filter(team => team.id !== teamToDelete));
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting team: ", error);
      alert("Error deleting team");
    }
  };

  const handleInvitePopup = (teamId) => {
    setTeamToInvite(teamId);
    setShowInvitePopup(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-90">
      <Navbar />
      <div className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex w-full max-w-7xl">
          <div className="flex-grow mr-8">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-gray-800">Your Teams</h1>
            </div>
            {teams.map((team, index) => (
              <div
                key={team.id}
                className="mr-20 flex items-center p-8 border-2 rounded-3xl shadow-xl mb-4 hover:bg-gray-200 transition duration-150 cursor-pointer"
                onClick={() => navigate(`/team/${team.id}`)}
              >
                <div
                  style={{ backgroundColor: team.bgColor }}
                  className="flex items-center justify-center w-16 h-16 rounded-full mr-4 text-4xl"
                >
                  {team.symbol}
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-semibold text-gray-800">{team._name}</h2>
                  <p className="text-gray-600">
                    {team.members.map(member => member._name).join(', ')}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDeleteTeam(team.id);
                    }}
                    className="text-3xl transform transition-transform duration-150 hover:scale-125 hover:rotate-12"
                  >
                                      🗑️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInvitePopup(team.id);
                    }}
                    className="text-3xl transform transition-transform duration-150 hover:scale-125 hover:rotate-12"
                  >
                    📩
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full max-w-sm pt-20">
            <div className="bg-white p-8 rounded-md shadow-xl mb-8 border-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a New Team</h2>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team Name"
                className="w-full py-2 px-4 border border-gray-300 rounded-md mb-4"
              />
              <button
                onClick={createTeam}
                className="w-full py-2 px-4 bg-primary text-white rounded-md shadow hover:bg-secondary transition duration-150 mb-4"
              >
                Create Team
              </button>
              <button
                onClick={() => setShowInvitations(!showInvitations)}
                className="w-full py-2 px-4 bg-secondary text-white rounded-md shadow hover:bg-primary transition duration-150"
              >
                Mail Inbox
              </button>
              {showInvitations && (
                <div className="mt-4">
                  {invitations.length === 0 ? (
                    <p className="text-gray-600">No pending invitations</p>
                  ) : (
                    invitations.map(invitation => (
                      <div key={invitation.id} className="bg-gray-100 p-4 rounded-md mb-2">
                        <p className="text-gray-800">{invitation.teamName}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-4 bg-red-500 justify-center text-white rounded-md shadow hover:bg-red-700 transition duration-150"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <Footer />
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded">
            <h2>Are you sure you want to delete this team?</h2>
            <button
              onClick={() => {
                deleteTeam();
                setShowDeleteConfirmation(false);
              }}
              className="mr-4 p-2 bg-red-500 text-white"
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteConfirmation(false)}
              className="p-2 bg-gray-300"
            >
              No
            </button>
          </div>
        </div>
      )}
      {showInvitePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded">
            <h2>Invite Member to Team</h2>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Invite by Email"
              className="border p-2 w-full mb-4"
            />
            <button
              onClick={() => {
                inviteUser(teamToInvite);
                setShowInvitePopup(false);
              }}
              className="mr-4 p-2 bg-blue-500 text-white"
            >
              Invite
            </button>
            <button
              onClick={() => setShowInvitePopup(false)}
              className="p-2 bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;

                   
