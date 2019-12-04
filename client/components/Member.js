import React from 'react';
import {useSelector} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Icon, Menu} from 'semantic-ui-react';
// import {deleteTeamMemberThunk} from '../store';

const Member = props => {
  const {member} = props;

  //team info for checking if user is choreographer in this team
  const teamId = +props.match.params.teamId;
  const teams = useSelector(state => state.teams);
  const thisTeam = teams.find(team => team.id === teamId);
  const isChoreo = member.userteams.role === 'choreographer';

  console.log('TCL: member.userteams.role', member.userteams.role);

  return isChoreo ? (
    // return (
    <Menu.Item>
      {/* <Menu.Content> */}
      <Icon name="star" /> {member.name}
      {/* </Menu.Content> */}
    </Menu.Item>
  ) : (
    <Menu.Item>
      {/* <Menu.Content> */}
      <Icon name="male" /> {member.name}
      {/* </Menu.Content> */}
    </Menu.Item>
  );
  // // </Menu.Item>
  // );
  // return (
  // <Menu.Item>
  //   {thisTeam && thisTeam.role === 'choreographer' && (
  //     <Menu.Content floated="right">
  //       <Icon
  //         name="trash"
  //         onClick={() => props.handleUpdateTeam(teamId, member.id)}
  //       />
  //     </Menu.Content>
  //   )}
  // <Menu.Item>
  // <div>
  //   {member.userteams.role === 'choreographer' ? (
  //     <Menu.Content>
  //       <Icon name="star" /> {member.name}
  //     </Menu.Content>
  //   ) : (
  //     <Menu.Content>
  //       <Icon name="male" /> {member.name}
  //     </Menu.Content>
  //   )}
  // </div>
  // {/* </Menu.Item> */}
  // );
};

export default withRouter(Member);
