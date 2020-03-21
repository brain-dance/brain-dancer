import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'semantic-ui-react';
import {postAssignment, deleteAssignment} from '../store';
import PropTypes from 'prop-types';

const AssignRoutine = props => {
  const dispatch = useDispatch();
  const routine = useSelector(state => state.singleRoutine);
  let assignedUsers = [];
  if (routine.assignments) {
    assignedUsers = routine.assignments.map(assignment => assignment.userId);
  }
  return (
    <React.Fragment>
      <Button
        type="button"
        content="X"
        onClick={() => props.setModal(false)}
        floated="right"
      />
      <h1>Add Users</h1>
      {props.members.map(member => {
        return (
          <div key={member.id}>
            {member.name}
            <Button
              type="button"
              content={
                assignedUsers.includes(member.id) ? 'Unassign' : 'Assign'
              }
              onClick={() => {
                if (assignedUsers.includes(member.id)) {
                  dispatch(
                    deleteAssignment(
                      routine.assignments.find(
                        assignment => assignment.userId === member.id
                      ).id
                    )
                  );
                } else {
                  dispatch(postAssignment(member.id, routine.id));
                }
              }}
            />
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default AssignRoutine;
