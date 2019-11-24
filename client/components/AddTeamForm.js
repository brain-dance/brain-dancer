import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Form} from 'semantic-ui-react';
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
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Add a Team</h2>
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
      <Form.Button>Submit</Form.Button>
    </Form>
  );
};

export default AddTeamForm;
