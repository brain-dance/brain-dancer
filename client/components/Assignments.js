import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Header, Image, Item, Label, Segment} from 'semantic-ui-react';
import {fetchAssignments} from '../store/assignment';

export const Assignments = props => {
  const assignments = useSelector(state => state.assignment);
  //Q. DO WE WANT ASSIGNMENTS AS AN OBJECT??
  console.log('TCL: assignments', assignments);
  const [isActiveItem, setIsActiveItem] = useState('');
  const dispatch = useDispatch();
  const handleItemClick = (e, {name}) => {
    setIsActiveItem(name);
  };

  useEffect(() => {
    dispatch(fetchAssignments());
  });

  const redirectToDashboard = () => {
    props.history.push('/dashboard');
  };

  return !assignments.length ? (
    <Segment placeholder color="orange">
      <Header icon>
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
    // <Menu pointing vertical>
    <div>
      {assignments.map(assignment => {
        return (
          <Item
            key={assignment.id}
            name={assignment.id}
            active={isActiveItem === name}
            onClick={handleItemClick}
          >
            {/* THIS WILL BE THE ROUTINE SPLASH IMAGE? */}
            {/* INCLUDE TEAM NAME? */}
            <Image
              size="mini"
              src="https://cnjballet.com/files/2019/05/ballerina_3502865_1280.png"
            />
            {assignment.completed ? (
              <Label color="olive" />
            ) : (
              <Label color="pink" />
            )}
          </Item>
        );
      })}
    </div>
    // </Menu>
  );
};

export default withRouter(Assignments);
