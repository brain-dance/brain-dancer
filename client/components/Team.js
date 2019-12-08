import React, {useState} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Routines, MembersSidebar} from './index';
import {Segment, Button, Icon, Sidebar, Radio} from 'semantic-ui-react';
import {useSelector} from 'react-redux';

const Team = props => {
  const teamId = props.match.params.teamId;
  const {setMemberModalOpen} = props;
  const team = useSelector(state => state.teams.find(t => t.id === +teamId));
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setVisible(true);
  };

  return !team || !team.role ? (
    <Segment basic>
      <div>
        You do not have any teams yet. Reach out to your choreographer to make
        sure they have created a team!
      </div>
    </Segment>
  ) : (
    <React.Fragment>
      <Sidebar.Pushable as={Segment}>
        <MembersSidebar
          members={team.members}
          handleUpdateTeam={props.handleUpdateTeam}
          handleOpen={handleOpen}
          visible={visible}
          setVisible={setVisible}
          setMemberModalOpen={setMemberModalOpen}
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
        id="toggleBtn"
        circular
        icon="users"
        onClick={handleOpen}
      />
    </React.Fragment>
  );
};

export default withRouter(Team);
