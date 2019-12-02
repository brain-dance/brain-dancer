import React from 'react';
import {Link} from 'react-router-dom';
import {Icon, Menu} from 'semantic-ui-react';
import TeamList from './TeamList';
// import AssignmentList from './Assignments';

export const DashSidebar = props => {
  const {teams, selectedTeam, handleSelectTeam} = props;

  const handleClickAddTeam = () => {
    props.setModalOpen(true);
  };

  return teams.length ? (
    <Menu vertical id="sidebar">
      <Menu.Item>
        {/* ARE WE PICTURING THIS AS A SEPARATE PAGE? */}
        <Menu.Header as={Link} to="/my-assignments">
          Assignments
        </Menu.Header>
      </Menu.Item>
      {/* <Menu.Menu>
        <AssignmentList
          assignments={assignments}
          // selectedAssignment={selectedAssignment}
          // handleSelectAssignment={handleSelectAssignment}
        />
      </Menu.Menu> */}
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
