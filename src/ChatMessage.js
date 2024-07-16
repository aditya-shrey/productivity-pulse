import React from 'react';
import { auth } from './firebase';  // Import your firebase configuration

function ChatMessage({ message }) {
  const { text, uid } = message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={auth.currentUser.photoURL} alt="user avatar" />
      <p>{text}</p>
    </div>
  );
}

export default ChatMessage;
