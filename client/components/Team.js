import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Routines, MembersSidebar} from './index';
import {Segment, Button, Icon, Sidebar} from 'semantic-ui-react';
import {useSelector} from 'react-redux';

const Team = props => {
  const teamId = props.match.params.teamId;
  const team = useSelector(state => state.teams.find(t => t.id === +teamId));

  const myRole = team.role;
  return !team || !myRole ? (
    <Segment color="orange">You are no longer on this team.</Segment>
  ) : (
    <Sidebar.Pushable as={Segment}>
      <MembersSidebar
        members={team.members}
        handleUpdateTeam={props.handleUpdateTeam}
      />
      <Sidebar.Pusher>
        <Segment raised id="team">
          {myRole === 'choreographer' && (
            <Button.Group id="record-button">
              <Button
                color="orange"
                onClick={() => props.setMemberModalOpen(true)}
              >
                <Icon name="user plus" />
              </Button>
              <Button primary as={Link} to={`/team/${team.id}/add`}>
                <Icon name="add" />
                <Icon name="record" />
              </Button>
            </Button.Group>
          )}
          <Routines team={team} routines={team.routines} />
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default withRouter(Team);
