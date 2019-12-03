import React from 'react';
import {Link} from 'react-router-dom';
import {Icon, Menu} from 'semantic-ui-react';
import TeamList from './TeamList';

export const DashSidebar = props => {
  const {teams, selectedTeam, handleSelectTeam} = props;

  const handleClickAddTeam = () => {
    props.setModalOpen(true);
  };

  return teams.length ? (
    <Menu vertical id="sidebar">
      <Menu.Item>
        <Menu.Header as={Link} to="/my-assignments">
          Assignments
        </Menu.Header>
      </Menu.Item>
      <Menu.Item>
        <Menu.Header>Teams</Menu.Header>
      </Menu.Item>
      <Menu.Menu>
        <TeamList
          teams={teams}
          selectedTeam={selectedTeam}
          handleSelectTeam={handleSelectTeam}
        />
        <Menu.Item onClick={handleClickAddTeam}>
          <Icon name="add" /> Add a Team
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  ) : (
    <h3>Error!</h3>
  );
};

export default DashSidebar;
