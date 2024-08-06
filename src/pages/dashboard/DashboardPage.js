import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp, doc, getDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../firebase/firebase';
import Footer from '../../components/Footer';
import { signOut } from 'firebase/auth';
import Navbar from '../../components/Navbar';
import { signInWithGoogle } from '../auth/Authentication';

function DashboardPage() {
  const [teams, setTeams] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [showInvitations, setShowInvitations] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [newTeamPopup, setNewTeamPopup] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([]);
  const [teamToDelete, setTeamToDelete] = useState(null); // eslint-disable-line no-unused-vars
  const [teamToInvite, setTeamToInvite] = useState(null); // eslint-disable-line no-unused-vars  
  const navigate = useNavigate();

  const getRandomPastelColor = () => {
    const r = Math.floor((Math.random() * 127) + 127);
    const g = Math.floor((Math.random() * 127) + 127);
    const b = Math.floor((Math.random() * 127) + 127);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const symbols = useMemo(() => ['🌿', '🌵',  '🍀', '🍄', '🌈', '🎈', '🍁', '🌻', '🍇', '🍉', '🌺', '🍒', '🍎', '🌲', '🌳', '🌷'], []);

  const fetchTeams = useCallback(async () => {
    if (!auth.currentUser) {
      console.log('No user is signed in.');
      return;
    }
  
    try {
      const q = query(
        collection(firestore, 'teams'),
        where('_members', 'array-contains', auth.currentUser.uid),
        where('_deleted', '==', false)
      );
      const querySnapshot = await getDocs(q);

      const teamsData = await Promise.all(querySnapshot.docs.map(async (docSnapshot, index) => {
        const teamData = docSnapshot.data();
        const memberDocRefs = teamData._members.map(memberId => doc(firestore, 'users', memberId));
        const memberDocs = await Promise.all(memberDocRefs.map(getDoc));
        const membersData = memberDocs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        return {
          id: docSnapshot.id,
          ...teamData,
          members: membersData,
          bgColor: getRandomPastelColor(),
          symbol: symbols[index % symbols.length]
        };
      }));
  
      setTeams(teamsData);
    } catch (error) {
      console.error('Error fetching teams: ', error);
    }
  }, [symbols]);
  
  

  const fetchInvitations = useCallback(async () => {
    if (!auth.currentUser) {
      console.log('No user is signed in.');
      return;
    }
  
    const invitationsCollectionRef = collection(firestore, 'users', auth.currentUser.uid, 'invitations');
    const q = query(invitationsCollectionRef, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    
    const invitationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const uniqueInvitations = [];
    const teamIds = new Set();
    for (const invitation of invitationsData) {
      if (!teamIds.has(invitation.teamId)) {
        uniqueInvitations.push(invitation);
        teamIds.add(invitation.teamId);
      }
    }
  
    setInvitations(uniqueInvitations);
  }, []);
  

  useEffect(() => {
    fetchTeams();
    fetchInvitations();
  }, [fetchTeams, fetchInvitations]);

  const createTeam = async () => {
    if (newTeamName.trim() === '' || newTeamDesc.trim() === '') {
      alert('Team name and description cannot be empty');
      return;
    }

    try {
      const newTeam = {
        _name: newTeamName,
        _desc: newTeamDesc,
        _admin: auth.currentUser.uid,
        _members: [auth.currentUser.uid],
        _createdAt: serverTimestamp(),
        _deleted: false
      };

      const docRef = await addDoc(collection(firestore, 'teams'), newTeam);
      await inviteUsersToNewTeam(docRef.id);
      setNewTeamName('');
      setNewTeamDesc('');
      setInvitedEmails([]);
      setNewTeamPopup(false);
      alert('Team created successfully');
      fetchTeams(); 
    } catch (error) {
      console.error('Error creating team: ', error);
      alert('Error creating team');
    }
  };

  const inviteUsersToNewTeam = async (teamId) => {
    try {
      for (const email of invitedEmails) {
        const usersCollectionRef = collection(firestore, 'users');
        const q = query(usersCollectionRef, where('_email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userId = userDoc.id;

          const invitationsCollectionRef = collection(firestore, 'users', userId, 'invitations');
          await addDoc(invitationsCollectionRef, {
            teamId,
            teamName: newTeamName,
            invitedAt: serverTimestamp(),
            status: 'pending'
          });

          alert(`User invited successfully to ${email}`);
        } else {
          alert(`User not found for email: ${email}`);
        }
      }
    } catch (error) {
      console.error('Error inviting user: ', error);
      alert('Error inviting user');
    }
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/signin');
    }).catch((error) => {
      console.error('Error signing out: ', error);
      alert('Error signing out');
    });
  };

  const deleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      const teamDocRef = doc(firestore, 'teams', teamToDelete);
      await updateDoc(teamDocRef, {
        _deleted: true
      });

      alert('Team deleted successfully');
      setTeams(teams.filter(team => team.id !== teamToDelete));
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting team: ', error);
      alert('Error deleting team');
    }
  };

  const acceptInvitation = async (invitationId, teamId) => {
    try {
      const userId = auth.currentUser.uid;
      const invitationDocRef = doc(firestore, 'users', userId, 'invitations', invitationId);

      await updateDoc(invitationDocRef, { status: 'accepted' });

      const teamDocRef = doc(firestore, 'teams', teamId);

      await updateDoc(teamDocRef, {
        _members: arrayUnion(userId)
      });
  
      alert('Invitation accepted');
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
  
      await deleteDoc(invitationDocRef);
  
      fetchTeams();
    } catch (error) {
      console.error('Error accepting invitation: ', error);
      alert('Error accepting invitation');
    }
  };
  
  const declineInvitation = async (invitationId) => {
    try {
      const userId = auth.currentUser.uid;
      const invitationDocRef = doc(firestore, 'users', userId, 'invitations', invitationId);
  
      await updateDoc(invitationDocRef, { status: 'declined' });
  
      alert('Invitation declined');
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
  
      await deleteDoc(invitationDocRef);
    } catch (error) {
      console.error('Error declining invitation: ', error);
      alert('Error declining invitation');
    }
  };
  

  const addEmailToInviteList = () => {
    if (inviteEmail.trim() === '') {
      alert('Email cannot be empty');
      return;
    }
    if (invitedEmails.includes(inviteEmail)) {
      alert('This email is already invited');
      return;
    }
    setInvitedEmails([...invitedEmails, inviteEmail]);
    setInviteEmail('');
    alert('Email invited successfully');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-90">
      <Navbar signInWithGoogle={signInWithGoogle} />
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
                    {team._desc}
                  </p>
                </div>
                
              </div>
            ))}
          </div>
          <div className="w-full max-w-sm pt-20">
            <div className="bg-white p-8 rounded-md shadow-xl mb-8 border-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a New Team</h2>
              <button
                onClick={() => setNewTeamPopup(true)}
                className="w-full py-2 px-4 bg-primary text-white rounded-md shadow hover:bg-secondary transition duration-150 mb-4"
              >
                Create Team
              </button>
              <button
                onClick={() => setShowInvitations(!showInvitations)}
                className="w-full py-2 px-4 bg-secondary text-white rounded-md shadow hover:bg-primary transition duration-150 relative"
              >
                Mail Inbox
                {invitations.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full"></span>
                )}
              </button>
              {showInvitations && (
                <div className="mt-4">
                  {invitations.length === 0 ? (
                    <p className="text-gray-600">No pending invitations</p>
                  ) : (
                    invitations.map(invitation => (
                      <div key={invitation.id} className="bg-gray-100 p-4 rounded-md mb-2">
                        <p className="text-gray-800">{invitation.teamName}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => acceptInvitation(invitation.id, invitation.teamId)}
                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => declineInvitation(invitation.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md"
                          >
                            Decline
                          </button>
                        </div>
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
                inviteUsersToNewTeam(teamToInvite);
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
      {newTeamPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded">
            <h2>Create a New Team</h2>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team Name"
              className="border p-2 w-full mb-4"
            />
            <textarea
              value={newTeamDesc}
              onChange={(e) => setNewTeamDesc(e.target.value)}
              placeholder="Team Description"
              className="border p-2 w-full mb-4"
            />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Invite by Email"
              className="border p-2 w-full mb-4"
            />
            <button
              onClick={addEmailToInviteList}
              className="mr-4 p-2 bg-blue-500 text-white"
            >
              Add Email
            </button>
            <div className="mt-4">
              {invitedEmails.length > 0 && (
                <div>
                  <h3>Invited Emails:</h3>
                  <ul>
                    {invitedEmails.map((email, index) => (
                      <li key={index}>{email}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={createTeam}
              className="mr-4 p-2 bg-green-500 text-white"
            >
              Create Team
            </button>
            <button
              onClick={() => setNewTeamPopup(false)}
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
