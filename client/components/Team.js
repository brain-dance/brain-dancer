import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Routines, Members} from './index';
import {Segment, Header, Button, Icon} from 'semantic-ui-react';

const Team = props => {
  const team = props.team;

  const myRole = team.role;
  return (
    <Segment raised id="team">
      <Header as="h1">
        {team.name}{' '}
        {myRole === 'choreographer' && (
          <Button.Group floated="right">
            <Button
              color="orange"
              onClick={() => props.setMemberModalOpen(true)}
            >
              <Icon name="user plus" />
            </Button>
            <Button primary as={Link} to={`/team/${props.team.id}/add`}>
              <Icon name="add" />
              <Icon name="record" />
            </Button>
          </Button.Group>
        )}
      </Header>

      <Routines team={team} routines={team.routines} />
      <Members
        members={team.members}
        handleUpdateTeam={props.handleUpdateTeam}
      />
    </Segment>
  );
};

export default withRouter(Team);
