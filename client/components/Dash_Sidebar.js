import React, {useState} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {Header, Button, Icon, Segment, Grid, Menu} from 'semantic-ui-react';
import TeamList from './TeamList';

// import {getUser} from '../store/user';

export const DashSidebar = props => {
  const {teams, selectedTeam, handleSelectTeam} = props;
  // const {teams} = user;

  const [isClickedAddTeam, setIsClickedAddTeam] = useState(false);

  const handleClickAddTeam = () => {
    setIsClickedAddTeam(true);
  };

  return teams.length ? (
    <Menu vertical id="sidebar">
      <Menu.Item>
        <Menu.Header as={Link} to="/assignments">
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
