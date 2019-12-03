import React from 'react';
import {useDispatch} from 'react-redux';
import {Button} from 'semantic-ui-react';

const AssignRoutine = props => {
  const dispatch = useDispatch();

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
            <Button type="button" onClick={() => console.log(member)} />
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default AssignRoutine;
