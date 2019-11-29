import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {List, Icon} from 'semantic-ui-react';

const Member = props => {
  const {member} = props;

  const dispatch = useDispatch();

  //team info for checking if user is choreographer in this team
  const teamId = +props.match.params.teamId;
  const teams = useSelector(state => state.teams);
  const thisTeam = teams.filter(team => team.id === teamId);

  return (
    <List.Item>
      {thisTeam[0].role === 'choreographer' && (
        <List.Content floated="right">
          <Icon
            name="trash"
            onClick={() => dispatch(props.deleteMember(teamId, member.id))}
          />
        </List.Content>
      )}
      {member.userteams.role === 'choreographer' ? (
        <List.Content>
          <Icon name="star" /> {member.name}
        </List.Content>
      ) : (
        <List.Content>
          <Icon name="male" /> {member.name}
        </List.Content>
      )}
    </List.Item>
  );
};

export default withRouter(Member);
