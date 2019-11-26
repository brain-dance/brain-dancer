import React from 'react';

const Member = props => {
  const {member} = props;

  return <p>{member.name}</p>;
};

export default Member;
