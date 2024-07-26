import React from 'react';

const Chats = ({ chats, newChat, setNewChat, addChat }) => {
  // Sort the chats array by createdAt, oldest first
  const sortedChats = [...chats].sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div>
      <h2>Chats</h2>
      {sortedChats.map(chat => (
        <div key={chat.id} className="p-4 border-b border-gray-200 flex items-center">
          {chat.userPhotoURL && (
            <img src={chat.userPhotoURL} alt={chat.userName} className="w-8 h-8 rounded-full mr-2" />
          )}
          <p><strong>{chat.userName}:</strong> {chat.text}</p>
          <p className="ml-auto">{chat.createdAt.toDate().toLocaleString()}</p>
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
  );
};

export default Chats;