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
      as={Menu}
      inverted
      animation="overlay"
      icon="labeled"
      direction="right"
      onHide={handleHide}
      onShow={handleOpen}
      vertical
      visible={visible}
      width="thin"
    >
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
