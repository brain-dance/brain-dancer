import React from 'react';
import {Link} from 'react-router-dom';
import {Icon, Menu} from 'semantic-ui-react';
import TeamList from './TeamList';

export const DashSidebar = props => {
  const {teams, selectedTeamId, setSelectedTeamId} = props;

  const handleClickAddTeam = () => {
    props.setModalOpen(true);
  };

  return teams.length ? (
    <Menu vertical id="sidebar">
      <Menu.Item
        active={selectedTeamId === 0}
        as={Link}
        to="/my-assignments"
        onClick={() => setSelectedTeamId(0)}
      >
        Assignments
      </Menu.Item>
      <Menu.Item>
        <Menu.Header>Teams</Menu.Header>
      </Menu.Item>
      <Menu.Menu>
        <TeamList
          teams={teams}
          selectedTeamId={selectedTeamId}
          setSelectedTeamId={setSelectedTeamId}
        />
        <Menu.Item id="add-team" onClick={handleClickAddTeam}>
          <Icon name="add" /> Add a Team
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  ) : (
    <h3>Error!</h3>
  );
};

DashSidebar.propTypes = {
  teams: PropTypes.array,
  selectedTeamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedTeamId: PropTypes.func,
  setModalOpen: PropTypes.func
};

export default DashSidebar;
