import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

function Navbar() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        setUserData(userDoc.data());
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/signin');
    }).catch((error) => {
      console.error("Error signing out: ", error);
      alert("Error signing out");
    });
  };

  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <img src={userData?.iconURL} alt="User Icon" className="w-8 h-8 rounded-full mr-2" />
        <span>{userData?.name}</span>
      </div>
      <div>
        <button onClick={() => navigate('/dashboard')} className="mr-4">Dashboard</button>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </nav>
  );
}

export default Navbar;
