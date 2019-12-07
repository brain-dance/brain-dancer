import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Card, Header, Image, Segment} from 'semantic-ui-react';
import {fetchAssignments} from '../store/assignment';
import Routine from './Routine';

const Assignments = props => {
  console.log('in assignments');
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
    <Segment placeholder className="stripped" textAlign="center">
      <Header>
        Your tasks are done. Go you!{' '}
        <Image
          size="big"
          src="https://static.thenounproject.com/png/26965-200.png"
        />
      </Header>
    </Segment>
  ) : (
    <div id="assignments">
      {pendingAssignments.map(assignment => {
        const routine = assignment.routine;
        if (assignment.completed !== true) {
          return (
            <Routine key={routine.id} routine={routine} team={routine.team} />
          );
        }
      })}
    </div>
  );
};

export default Assignments;
