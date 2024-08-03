import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Chats = ({ chats, newChat, setNewChat, addChat }) => {
  const sortedChats = [...chats].sort((a, b) => a.createdAt - b.createdAt);

  const chatEndRef = useRef(null);
  const textAreaRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addChat();
      resetTextarea();
    }
  };

  const handleInputChange = (e) => {
    setNewChat(e.target.value);
    resizeTextarea();
  };

  const resizeTextarea = () => {
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
  };

  const resetTextarea = () => {
    setNewChat('');
    textAreaRef.current.style.height = 'auto';
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold mb-4 text-center">Team Chat</h2>
      <div className="flex-1 overflow-y-auto p-6">
        
        <div className="overflow-y-auto mb-4">
          {sortedChats.map(chat => (
            <div key={chat.id} className="p-4 flex items-start">
              {chat.userPhotoURL && (
                <img src={chat.userPhotoURL} alt={chat.userName} className="mt-2 w-10 h-10 rounded-full mr-3" />
              )}
              <div className="flex-1">
                <p className="text-md font-medium text-gray-900"><strong>{chat.userName}</strong></p>
                <p className="text-md text-gray-700">{chat.text}</p>
              </div>
              <p className="text-xs pl-12 text-gray-500 self-end">{chat.createdAt.toDate().toLocaleString()}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="p-4 bg-white shadow-lg flex items-center">
        <textarea
          ref={textAreaRef}
          value={newChat}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:border-blue-400 resize-none overflow-hidden"
          rows={1}
        />
        <button
          onClick={() => {
            addChat();
            resetTextarea();
          }}
          className="ml-2 p-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

Chats.propTypes = {
  chats: PropTypes.arrayOf(PropTypes.object).isRequired,
  newChat: PropTypes.string.isRequired,
  setNewChat: PropTypes.func.isRequired,
  addChat: PropTypes.func.isRequired
};

export default Chats;
