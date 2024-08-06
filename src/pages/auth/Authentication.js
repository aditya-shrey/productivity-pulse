import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        _createdAt: serverTimestamp(),
        _email: user.email,
        _name: user.displayName,
        _teams: []
      });
      console.log('New user created in Firestore');
    }
  } catch (error) {
    console.error('SignIn error: ', error);
  }
};
