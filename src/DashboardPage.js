import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from './firebase';
import Navbar from './Navbar';
import { signOut } from 'firebase/auth';
import { arrayUnion } from 'firebase/firestore';

function DashboardPage() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [invitations, setInvitations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      const q = query(collection(firestore, 'teams'), where('_members', 'array-contains', auth.currentUser.uid), where('_deleted', '==', false));
      const querySnapshot = await getDocs(q);
      const teamsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsData);
    };

    const fetchInvitations = async () => {
      const invitationsCollectionRef = collection(firestore, 'users', auth.currentUser.uid, 'invitations');
      const q = query(invitationsCollectionRef, where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const invitationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvitations(invitationsData);
    };

    fetchTeams();
    fetchInvitations();
  }, []);

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

  const acceptInvitation = async (invitationId, teamId) => {
    try {
      // Update the invitation status
      const invitationDocRef = doc(firestore, 'users', auth.currentUser.uid, 'invitations', invitationId);
      await updateDoc(invitationDocRef, { status: 'accepted' });

      // Add the user to the team's members
      const teamDocRef = doc(firestore, 'teams', teamId);
      await updateDoc(teamDocRef, {
        _members: arrayUnion(auth.currentUser.uid)
      });

      alert("Invitation accepted");
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error("Error accepting invitation: ", error);
      alert("Error accepting invitation");
    }
  };

  const declineInvitation = async (invitationId) => {
    try {
      const invitationDocRef = doc(firestore, 'users', auth.currentUser.uid, 'invitations', invitationId);
      await updateDoc(invitationDocRef, { status: 'declined' });

      alert("Invitation declined");
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error("Error declining invitation: ", error);
      alert("Error declining invitation");
    }
  };

  return (
    <div>
      <Navbar />
      <center>
        <h1>Your Teams</h1>
        <div>
          {teams.map(team => (
            <div key={team.id}>
              <h2>{team._name}</h2>
              <p>{team._desc}</p>
              <button onClick={() => navigate(`/team/${team.id}`)}>Go to Team</button>
            </div>
          ))}
        </div>
        <div>
          <h2>Create a New Team</h2>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name"
          />
          <button onClick={createTeam}>Create Team</button>
        </div>
        <div>
          <h2>Pending Invitations</h2>
          {invitations.map(invitation => (
            <div key={invitation.id}>
              <p>{invitation.teamName}</p>
              <button onClick={() => acceptInvitation(invitation.id, invitation.teamId)}>Accept</button>
              <button onClick={() => declineInvitation(invitation.id)}>Decline</button>
            </div>
          ))}
        </div>
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </center>
    </div>
  );
}

export default DashboardPage;
