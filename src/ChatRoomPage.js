import React, { useState } from 'react';
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from './firebase';
import ChatMessage from './ChatMessage';

function ChatRoomPage() {
  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages, loading, error] = useCollectionData(q, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  if (loading) {
    console.log("Loading messages...");
    return <div>Loading messages...</div>;
  }

  if (error) {
    console.error("Firestore error: ", error);
    return <div>Error: {error.message}</div>;
  }

  console.log("Messages: ", messages); // Add this line to debug

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    try {
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL
      });
      setFormValue('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }

  return (
    <>
    <center>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </center>
    </>
  );
}

export default ChatRoomPage;
