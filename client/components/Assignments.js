import React, {useState} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
import {Image, Label, Menu} from 'semantic-ui-react';

export const Assignments = props => {
  const [isActiveItem, setIsActiveItem] = useState('');

  // useEffect(() => {
  //   dispatch(fetchAssignments());
  // });

  const handleItemClick = (e, {name}) => {
    setIsActiveItem(name);
  };

  return !assignments.length ? (
    <div>
      <br />
      <Image
        size="mini"
        src="https://static.thenounproject.com/png/26965-200.png"
      />
      <p>Your tasks are done. Go you!</p>
    </div>
  ) : (
    <Menu pointing vertical>
      {assignments.map(assignment => {
        return (
          <Menu.Item
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
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default Assignments;
