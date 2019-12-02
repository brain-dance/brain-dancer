import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Form, Header, Icon} from 'semantic-ui-react';
import {addTeamThunk} from '../store';

const AddTeamForm = function(props) {
  const dispatch = useDispatch();

  const initFormState = {
    name: '',
    description: '',
    category: '',
    imgUrl: ''
  };

  const [formState, setFormState] = useState(initFormState);

  const options = [
    {key: 'b', text: 'ballet', value: 'ballet'},
    {key: 'h', text: 'tap', value: 'tap'},
    {key: 'w', text: 'waltz', value: 'waltz'}
  ];

  const handleSubmit = evt => {
    evt.preventDefault();
    dispatch(addTeamThunk(formState));
    props.setModalOpen(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header as="h2">Add a Team</Header>
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label="Team name"
          placeholder="Team name"
          onChange={evt => {
            setFormState({...formState, name: evt.target.value});
          }}
        />
        <Form.Select
          fluid
          label="Category"
          options={options}
          placeholder="Category"
          onChange={evt => {
            setFormState({...formState, category: evt.target.innerText});
          }}
        />
      </Form.Group>

      <Form.TextArea
        label="Description"
        placeholder="Tell us more about your team..."
        onChange={evt => {
          setFormState({...formState, description: evt.target.value});
        }}
      />
      <Form.Input
        fluid
        label="Image URL"
        placeholder="http://www.example.org/image.jpg"
        onChange={evt => {
          setFormState({...formState, imgUrl: evt.target.value});
        }}
      />
      <Form.Group>
        <Form.Button content="Submit" type="submit" color="blue" />
        <Form.Button
          content="Cancel"
          type="button"
          onClick={() => {
            props.setModalOpen(false);
          }}
        />
      </Form.Group>
    </Form>
  );
};

export default AddTeamForm;
