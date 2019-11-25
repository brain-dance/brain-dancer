import React from 'react';

const Member = props => {
  const {member} = props;

  return <h3>{member.name}</h3>;
};

export default Member;
