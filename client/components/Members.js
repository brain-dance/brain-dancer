import React from 'react';
import {Member} from './index';

const Members = props => {
  const {members} = props.members;

  return members.map(member => <Member member={member} key={member.id} />);
};

export default Members;
