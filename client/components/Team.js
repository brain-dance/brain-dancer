import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Routines, Members} from './index';
import {Segment, Header, Button, Icon} from 'semantic-ui-react';
import {useSelector} from 'react-redux';

const Team = props => {
  const teamId = props.match.params.teamId;
  const team = useSelector(state => state.teams.find(t => t.id === +teamId));

  const myRole = team.role;
  return (
    <Segment raised id="team">
      {myRole === 'choreographer' && (
        <Button.Group id="record-button">
          <Button color="orange" onClick={() => props.setMemberModalOpen(true)}>
            <Icon name="user plus" />
          </Button>
          <Button primary as={Link} to={`/team/${team.id}/add`}>
            <Icon name="add" />
            <Icon name="record" />
          </Button>
        </Button.Group>
      )}

      <Routines team={team} routines={team.routines} />
      <Members
        members={team.members}
        handleUpdateTeam={props.handleUpdateTeam}
      />
    </Segment>
  );
};

export default withRouter(Team);
