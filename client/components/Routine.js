import React from 'react';
import {withRouter} from 'react-router-dom';
import {Card} from 'semantic-ui-react';

const Routine = props => {
  const {routine, team} = props;
  let {id, title, url} = routine;
  const teamId = props.match.params.teamId || routine.teamId;

  const redirectToWatchRoutine = (e, {name}) => {
    let selectedRoutineId = name;

    props.history.push(`/team/${teamId}/routine/${selectedRoutineId}`);
  };

  return (
    //COULD ADD CHOREOGRAPHER [EAGER LOAD USERS ON ROUTINE]
    <Card
      className="vidCard"
      raised
      name={`${id}`}
      onClick={redirectToWatchRoutine}
    >
      <Card.Content>
        <video id={title} className="video-card" width="200" src={url} />
        <Card.Header>{title}</Card.Header>
        {team && team.name ? (
          <Card.Meta>{team.name}</Card.Meta>
        ) : (
          <Card.Meta>Team Name</Card.Meta>
        )}
      </Card.Content>
    </Card>
  );
};

export default withRouter(Routine);
