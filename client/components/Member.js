import React from 'react';
import {useSelector} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Icon, Menu} from 'semantic-ui-react';
// import {deleteTeamMemberThunk} from '../store';

const Member = props => {
  const {member, handleUpdateTeam} = props;

  //team info for checking if user is choreographer in this team
  const teamId = +props.match.params.teamId;
  const teams = useSelector(state => state.teams);
  const thisTeam = teams.find(team => team.id === teamId);
  const memberIsChoreo = member.userteams.role === 'choreographer';

  return (
    <Menu.Item id="members">
      {memberIsChoreo ? <Icon name="star" /> : <Icon name="male" />}{' '}
      {member.name}
      {thisTeam && thisTeam.role === 'choreographer' ? (
        <Icon
          size="small"
          floated="right"
          name="trash"
          onClick={() => handleUpdateTeam(teamId, member.id)}
        />
      ) : (
        ''
      )}
    </Menu.Item>
  );
};

export default withRouter(Member);
