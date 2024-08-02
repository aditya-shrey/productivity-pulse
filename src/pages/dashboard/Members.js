import React from 'react';

function Members({ members, inviteEmail, setInviteEmail, inviteUser, confirmRemoveUser, team, auth }) {

  const handleInvite = () => {
    inviteUser(inviteEmail, team);
    setInviteEmail("");
  };

  return (
    <div className="flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6">Members</h2>
        <ul className="space-y-4">
          {members.map((member) => (
            <li key={member.id} className="p-4 bg-gray-50 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {member.photoURL ? (  
                    <img
                      src={member._photoURL}
                      alt={member._name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full mr-4 bg-gray-200 text-gray-600"
                    >
                      {member._name[0]}
                    </div>
                  )}
                  <p className="font-semibold text-xl">{member._name}</p>
                </div>
                {auth.currentUser.uid === team._admin && member.id !== team._admin && (
                  <button
                    onClick={() => confirmRemoveUser(member.id)}
                    className="py-2 px-4 bg-red-500 text-white rounded shadow hover:bg-red-600 transition duration-150"
                  >
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Invite New Member</h3>
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Enter email to invite"
          className="border p-2 w-full mb-4"
        />
        <button
          onClick={handleInvite}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-150"
        >
          Invite
        </button>
      </div>
    </div>
  );
}

export default Members;
