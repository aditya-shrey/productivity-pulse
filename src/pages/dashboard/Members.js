import React, { useState } from 'react';

function Members({ members, inviteEmail, setInviteEmail, inviteUser, confirmRemoveUser, team, auth }) {
  const [expandedMember, setExpandedMember] = useState(null);

  const toggleExpandMember = (memberId) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6">Members</h2>
      <ul className="space-y-4">
        {members.map(member => (
          <li key={member.id} className="p-4 bg-gray-50 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{member._name}</p>
              </div>
              {/* <button
                onClick={() => toggleExpandMember(member.id)}
                className="text-blue-500 hover:text-blue-700 transition duration-150"
              >
                {expandedMember === member.id ? 'Less' : 'More'}
              </button> */}
            </div>
            {expandedMember === member.id && (
              <div className="mt-4">
                {/* Add any additional information about the member here */}
                {auth.currentUser.uid === team._admin && member.id !== team._admin && (
                  <button
                    onClick={() => confirmRemoveUser(member.id)}
                    className="py-2 px-4 bg-red-500 text-white rounded shadow hover:bg-red-600 transition duration-150"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Invite New Member</h3>
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => {
            setInviteEmail(e.target.value);
            console.log("Invite Email Updated:", e.target.value);
          }}
          placeholder="Enter email to invite"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={() => {
            console.log("Invite Button Clicked with Email:", inviteEmail);
            inviteUser(inviteEmail, team);
          }}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-150"
        >
          Invite
        </button>
      </div>
    </div>
  );
}

export default Members;
