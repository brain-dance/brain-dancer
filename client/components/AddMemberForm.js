import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Form, Header, Icon} from 'semantic-ui-react';
import {fetchAllUsers, addTeamMemberThunk} from '../store';

const AddMemberForm = function(props) {
  const dispatch = useDispatch();
  const allUsers = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, []);

  const [userId, setUserId] = useState(0);
  const [role, setRole] = useState('dancer');

  const userOptions = allUsers.map(user => ({
    key: user.id,
    text: user.name,
    value: user.id
  }));

  const options = [
    {key: 'd', text: 'dancer', value: 'dancer'},
    {key: 'c', text: 'choreographer', value: 'choreographer'}
  ];

  const handleSubmit = evt => {
    evt.preventDefault();
    dispatch(addTeamMemberThunk(props.match.params.teamId, userId, role));
    props.setMemberModalOpen(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header as="h2">Add a Member</Header>
      <Form.Group widths="equal">
        <Form.Select
          fluid
          label="User"
          options={userOptions}
          onChange={evt => {
            setUserId(
              allUsers.find(user => user.name === evt.target.innerText).id
            );
          }}
        />
        <Form.Select
          fluid
          label="Role"
          options={options}
          onChange={evt => {
            setRole(evt.target.innerText);
          }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Button content="Add" type="submit" color="blue" />
        <Form.Button
          content="Cancel"
          type="button"
          onClick={() => {
            props.setMemberModalOpen(false);
          }}
        />
      </Form.Group>
    </Form>
  );
};

export default withRouter(AddMemberForm);
