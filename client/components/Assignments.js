import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Card, Header, Image, Segment} from 'semantic-ui-react';
import {fetchAssignments} from '../store/assignment';

export const Assignments = props => {
  const assignments = useSelector(state => state.assignments);
  const pendingAssignments = assignments.filter(
    assignment => assignment.completed === false
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [assignments.length]);

  const redirectToDashboard = () => {
    props.history.push('/dashboard');
  };

  const redirectToPractice = (e, {name}) => {
    let nameArr = name.split(' ');
    let selectedTeamId = +nameArr[0];
    let selectedRoutineId = +nameArr[1];

    props.history.push(
      `/team/${selectedTeamId}/routine/${selectedRoutineId}/add`
    );
  };

  return !pendingAssignments.length ? (
    <Segment placeholder color="orange" textAlign="center">
      <Header>
        Your tasks are done. Go you!{' '}
        <Image
          size="big"
          src="https://static.thenounproject.com/png/26965-200.png"
        />
      </Header>
      <Button primary onClick={redirectToDashboard}>
        Back to Dashboard
      </Button>
    </Segment>
  ) : (
    <div>
      <Header as="h3">Assignments</Header>
      <Card.Group itemsPerRow={3}>
        {pendingAssignments.map(assignment => {
          let {id, title, url, teamId, team} = assignment.routine;
          if (assignment.completed !== true) {
            return (
              <Card id="assgn" key={assignment.id} raised>
                <Card.Content>
                  <Card.Header>{title}</Card.Header>
                  {team && team.name ? (
                    <Card.Meta>{team.name}</Card.Meta>
                  ) : (
                    <Card.Meta>Team Name</Card.Meta>
                  )}
                  <video id={title} width="200" controls src={url} />
                  <Button
                    attached="bottom"
                    name={`${teamId} ${id}`}
                    // color="black"
                    primary
                    onClick={redirectToPractice}
                  >
                    Practice Routine
                  </Button>
                </Card.Content>
              </Card>
            );
          }
        })}
      </Card.Group>
    </div>
  );
};

export default withRouter(Assignments);
