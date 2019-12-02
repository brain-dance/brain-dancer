import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Card, Header, Image, Segment} from 'semantic-ui-react';
import {fetchAssignments} from '../store/assignment';

export const Assignments = props => {
  const assignments = useSelector(state => state.assignments);
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

  return !assignments.length ? (
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
      {assignments.map(assignment => {
        let {id, title, url, teamId} = assignment.routine;
        if (assignment.completed !== true) {
          return (
            <Card key={assignment.id}>
              <Card.Header>{title}</Card.Header>
              <Card.Content>
                {/* NEED TO GET TEAM NAME IN HERE! */}
                {teamId}
                <video id={title} width="200" controls src={url} />
                <Button
                  name={`${teamId} ${id}`}
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
    </div>
  );
};

export default withRouter(Assignments);
