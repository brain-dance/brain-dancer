import React from 'react';
import {Member} from './index';
import {Header, Segment, List} from 'semantic-ui-react';

const Members = props => {
  const members = props.members || [];

  return (
    <Segment basic color="blue">
      <Header as="h3">Members</Header>
      <List divided verticalAlign="middle">
        {members.map(member => (
          <Member member={member} key={member.id} />
        ))}
      </List>
    </Segment>
  );
};

export default Members;
