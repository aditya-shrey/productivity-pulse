import React from 'react';

function Members({ members, inviteEmail, setInviteEmail, inviteUser, confirmRemoveUser, team, auth }) {
  return (
    <div>
      <h2>Members</h2>
      <ul>
        {members.map(member => (
          <li key={member.id}>
            {member._name}
            {auth.currentUser.uid === team._admin && (
              <button onClick={() => confirmRemoveUser(member.id)}>Remove</button>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => {
            setInviteEmail(e.target.value);
            console.log("Invite Email Updated:", e.target.value);  // Log the updated email
          }}
          placeholder="Enter email to invite"
        />
        <button onClick={() => {
          console.log("Invite Button Clicked with Email:", inviteEmail);  // Log the email when the button is clicked
          inviteUser(inviteEmail, team);
        }}>
          Invite
        </button>
      </div>
    </div>
  );
}

export default Members;
