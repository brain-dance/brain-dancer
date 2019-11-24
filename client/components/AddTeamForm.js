import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Form} from 'semantic-ui-react';

const AddTeamForm = function(props) {
  const initFormState = {
    name: '',
    description: '',
    category: '',
    imgUrl: ''
  };
  const [formState, setFormState] = useState(initFormState);

  const options = [
    {key: 'b', text: 'Ballet', value: 'ballet'},
    {key: 'h', text: 'Hip Hop', value: 'hiphop'},
    {key: 'w', text: 'Waltz', value: 'waltz'}
  ];

  return (
    <Form>
      <h2>Add a Team</h2>
      <Form.Group widths="equal">
        <Form.Input fluid label="Team name" placeholder="Team name" />

        <Form.Select
          fluid
          label="Category"
          options={options}
          placeholder="Category"
        />
      </Form.Group>

      <Form.TextArea
        label="Description"
        placeholder="Tell us more about your team..."
      />
      <Form.Input
        fluid
        label="Image URL"
        placeholder="http://www.example.org/image.jpg"
      />
      <Form.Button>Submit</Form.Button>
    </Form>
  );
};

export default AddTeamForm;
