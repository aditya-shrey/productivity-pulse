import React from 'react';

const Members = ({ members, inviteEmail, setInviteEmail, inviteUser, confirmRemoveUser, team, auth }) => {
  return (
    <div>
      <h2>Members</h2>
      {members.map(member => (
        <div key={member.id}>
          <p>{member._name} ({member._email})</p>
          {auth.currentUser.uid === team._admin && member.id !== team._admin && (
            <button onClick={() => confirmRemoveUser(member.id)}>Remove</button>
          )}
        </div>
      ))}
      <input
        type="email"
        value={inviteEmail}
        onChange={(e) => setInviteEmail(e.target.value)}
        placeholder="Invite by Email"
        className="border p-2"
      />
      <button onClick={inviteUser} className="ml-2 p-2 bg-blue-500 text-white">Invite</button>
    </div>
  );
};

export default Members;
