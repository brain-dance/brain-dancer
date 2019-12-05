import React, {useState} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Routines, MembersSidebar} from './index';
import {Segment, Button, Icon, Sidebar, Radio} from 'semantic-ui-react';
import {useSelector} from 'react-redux';

const Team = props => {
  const teamId = props.match.params.teamId;
  const team = useSelector(state => state.teams.find(t => t.id === +teamId));
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setVisible(true);
  };

  return !team || !team.role ? (
    <Segment color="orange">You are no longer on this team.</Segment>
  ) : (
    <React.Fragment>
      <Sidebar.Pushable as={Segment}>
        <MembersSidebar
          members={team.members}
          handleUpdateTeam={props.handleUpdateTeam}
          handleOpen={handleOpen}
          visible={visible}
          setVisible={setVisible}
        />
        <Sidebar.Pusher>
          <Segment raised id="team">
            <Routines team={team} routines={team.routines} />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      {team.role === 'choreographer' && (
        <Button
          className={!visible ? 'visible' : 'hidden'}
          id="record-button"
          circular
          icon="record"
          as={Link}
          to={`/team/${team.id}/add`}
        />
      )}
      <Button
        className={!visible ? 'visible' : 'hidden'}
        id="toggle"
        circular
        icon="users"
        onClick={handleOpen}
      >
        {/* <div className="toggle">
          <p>Show Members</p>
          <Radio onClick={handleOpen} toggle />
        </div> */}
      </Button>
    </React.Fragment>
  );
};

export default withRouter(Team);
