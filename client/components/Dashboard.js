import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Grid} from 'semantic-ui-react';
import DashSidebar from './Dash_Sidebar';
import Team from './Team';
import Assignments from './Assignments';
import {fetchUserTeams, fetchUserAssignments} from '../store';

/**
 * COMPONENT
 */
export const Dashboard = props => {
  const teams = useSelector(state => state.teams);
  const assignments = useSelector(state => state.assignments);
  const dispatch = useDispatch();

  //TK: Identify which team/assign displays when user logs in (currently first one)
  const [selectedTeam, setSelectedTeam] = useState([]);
  // const [selectedAssgn, setSelectedAssgn] = useState([]);

  useEffect(() => {
    dispatch(fetchUserTeams());
  }, []);

  useEffect(() => {
    dispatch(fetchUserAssignments());
  }, [assignments.length]);

  const handleSelectTeam = team => {
    setSelectedTeam(team);
  };

  if (!teams || !teams.length) {
    return <h3>Unexpected error! You do not exist!</h3>;
  } else {
    return (
      <Grid>
        <Grid.Column width={5}>
          <DashSidebar
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            handleSelectTeam={handleSelectTeam}
            assignments={assignments}
          />
        </Grid.Column>
        <Grid.Column width={11}>
          <Team team={selectedTeam} />
        </Grid.Column>
      </Grid>
    );
  }
};

export default Dashboard;
