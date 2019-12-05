import React from 'react';
import {withRouter} from 'react-router-dom';
import {Member} from './index';
import {Menu, Sidebar} from 'semantic-ui-react';

const MembersSidebar = props => {
  const members = props.members || [];
  const {handleOpen, visible, setVisible} = props;

  const handleHide = () => {
    setVisible(false);
  };

  return (
    <Sidebar
      className="membersSidebar"
      as={Menu}
      inverted
      animation="overlay"
      direction="right"
      // icon="labeled"
      onHide={handleHide}
      onShow={handleOpen}
      vertical
      visible={visible}
      width="wide"
    >
      <Menu.Item header>Team Members</Menu.Item>
      {members.map(member => (
        <Member
          member={member}
          key={member.id}
          handleUpdateTeam={props.handleUpdateTeam}
        />
      ))}
    </Sidebar>
  );
};

export default withRouter(MembersSidebar);
