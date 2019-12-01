import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Grid} from 'semantic-ui-react';
import DashSidebar from './Dash_Sidebar';
import Team from './Team';
import {fetchUserTeams} from '../store';
import {fetchAssignments} from '../store/assignment';

/**
 * COMPONENT
 */
export const Dashboard = props => {
  const teams = useSelector(state => state.teams);
  const assignments = useSelector(state => state.assignment);
  // const isChoreographer = user.status === 'choreographer';
  const dispatch = useDispatch();

  //TK: Identify which team displays when user logs in (currently first one)
  const [selectedTeam, setSelectedTeam] = useState([]);

  useEffect(() => {
    dispatch(fetchUserTeams());
  }, []);

  useEffect(() => {
    dispatch(fetchAssignments);
  });

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
