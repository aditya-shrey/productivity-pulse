import React from 'react';
import PropTypes from 'prop-types';

function Members({ members, inviteEmail, setInviteEmail, inviteUser, confirmRemoveUser, team, auth }) {
  return (
    <div>
      <h2>Members</h2>
      <ul>
        {members.map(member => (
          <li key={member.id}>
            {member._name}
            {auth.currentUser.uid === team._admin && member.id !== team._admin && (
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
            console.log('Invite Email Updated:', e.target.value);
          }}
          placeholder="Enter email to invite"
        />
        <button onClick={() => {
          console.log('Invite Button Clicked with Email:', inviteEmail);
          inviteUser(inviteEmail, team);
        }}>
          Invite
        </button>
      </div>
    </div>
  );
}

Members.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  inviteEmail: PropTypes.string.isRequired,
  setInviteEmail: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired,
  confirmRemoveUser: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      uid: PropTypes.string
    })
  }).isRequired
};

export default Members;
