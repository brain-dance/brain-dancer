import React from 'react';
import {withRouter} from 'react-router-dom';
import {Member} from './index';
import {Icon, Menu, Sidebar} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const MembersSidebar = props => {
  const members = props.members || [];
  const {handleOpen, visible, setVisible} = props;

  const handleHide = () => {
    setVisible(false);
  };

  const handleClickAddMember = () => {
    props.setMemberModalOpen(true);
  };

  return (
    <Sidebar
      className="membersSidebar"
      as={Menu}
      inverted
      animation="overlay"
      direction="right"
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
      <br />
      <Menu.Item id="add-team" onClick={handleClickAddMember}>
        <Icon name="add" /> Add Member
      </Menu.Item>
    </Sidebar>
  );
};

MembersSidebar.propTypes = {
  members: PropTypes.array,
  handleOpen: PropTypes.func,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  handleUpdateTeam: PropTypes.func,
  setMemberModalOpen: PropTypes.func
};

export default withRouter(MembersSidebar);
