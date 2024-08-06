import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore, auth } from '../../firebase/firebase';

export const useInvites = (teamId) => {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const fetchInvites = async () => {
      if (!auth.currentUser) return;
      const invitesCollectionRef = collection(firestore, 'users', auth.currentUser.uid, 'invitations');
      const q = query(invitesCollectionRef, where('teamId', '==', teamId));
      const querySnapshot = await getDocs(q);
      const invitesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      const uniqueInvites = invitesData.reduce((acc, invite) => {
        const existingInviteIndex = acc.findIndex(i => i.teamId === invite.teamId);
        if (existingInviteIndex === -1 || invite.invitedAt > acc[existingInviteIndex].invitedAt) {
          if (existingInviteIndex !== -1) {
            acc.splice(existingInviteIndex, 1);
          }
          acc.push(invite);
        }
        return acc;
      }, []);

      setInvites(uniqueInvites);
    };

    fetchInvites();
  }, [teamId]);

  const inviteUser = async (inviteEmail, team) => {
    if (!inviteEmail || typeof inviteEmail !== 'string') {
      console.error('inviteEmail is not a valid string:', inviteEmail);
      alert('Email cannot be empty');
      return;
    }
  
    if (inviteEmail.trim() === '') {
      alert('Email cannot be empty');
      return;
    }
  
    try {
      const usersCollectionRef = collection(firestore, 'users');
      const q = query(usersCollectionRef, where('_email', '==', inviteEmail));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        alert('User not found');
        return;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      const invitationsCollectionRef = collection(firestore, 'users', userId, 'invitations');

      await addDoc(invitationsCollectionRef, {
        teamId,
        teamName: team._name,
        invitedAt: serverTimestamp(),
        status: 'pending',
      });
  
      alert('User invited successfully');
    } catch (error) {
      console.error('Error inviting user: ', error);
      alert('Error inviting user');
    }
  };
  
  

  return {
    invites,
    inviteUser,
  };
};
