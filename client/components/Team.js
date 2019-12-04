import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Routines, MembersSidebar} from './index';
import {Segment, Header, Button, Icon, Sidebar} from 'semantic-ui-react';
// import MembersSidebar from './MembersSidebar';
// import {TeamList} from './TeamList';

const Team = props => {
  const team = props.team;
  // const myRole = team.role;

  return !team || !team.role ? (
    <Segment color="orange">You are no longer on this team.</Segment>
  ) : (
    <Sidebar.Pushable as={Segment}>
      <MembersSidebar
        members={team.members}
        handleUpdateTeam={props.handleUpdateTeam}
      />
      <Sidebar.Pusher>
        <Segment raised id="team">
          <Header as="h1">
            {team.name}{' '}
            {team.role === 'choreographer' && (
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
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default withRouter(Team);
