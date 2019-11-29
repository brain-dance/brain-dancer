import React from 'react';

const Member = props => {
  const {member} = props;
  return (
    <div>
      {member.userteams.role === 'choreographer' ? (
        <p>
          {member.name} <em>(choreographer)</em>
        </p>
      ) : (
        <p>{member.name}</p>
      )}
    </div>
  );
};

export default Member;
