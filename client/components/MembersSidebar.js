import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Member} from './index';
import {Menu, Sidebar} from 'semantic-ui-react';

const MembersSidebar = props => {
  const members = props.members || [];
  const [visible, setVisible] = useState(true);

  //NEED WAY TO HANDLE OPEN
  const handleOpen = () => {
    setVisible(true);
  };

  const handleHide = () => {
    setVisible(false);
  };

  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      direction="right"
      onHide={handleHide}
      vertical
      visible={visible}
      width="wide"
    >
      {/* <Menu.Item> */}
      {members.map(member => (
        <Member
          member={member}
          key={member.id}
          handleUpdateTeam={props.handleUpdateTeam}
        />
      ))}
      {/* </Menu.Item> */}
      {/* <Menu.Item as="a">
          <Icon name="home" />
          Home
        </Menu.Item>
        <Menu.Item as="a">
          <Icon name="gamepad" />
          Games
        </Menu.Item>
        <Menu.Item as="a">
          <Icon name="camera" />
          Channels
        </Menu.Item>*/}
    </Sidebar>
  );
  //   <Sidebar.Pusher>
  //     <Segment basic>
  //       <Header as="h3">Members</Header>
  //       <Image src="/images/wireframe/paragraph.png" />
  //     </Segment>
  //   </Sidebar.Pusher>
  // </Sidebar.Pushable>
  // );
  // <Segment basic color="blue">
  //   <Header as="h3">Members</Header>
  //   <List divided verticalAlign="middle">
  //     {members.map(member => (
  //       <Member
  //         member={member}
  //         key={member.id}
  //         handleUpdateTeam={props.handleUpdateTeam}
  //       />
  //     ))}
  //   </List>
  // </Segment>
  // );
};

export default withRouter(MembersSidebar);
