import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Grid} from 'semantic-ui-react';
import DashSidebar from './Dash_Sidebar';
// import Team from './Team';

/**
 * COMPONENT
 */
export const Dashboard = props => {
  const user = useSelector(state => state.user);
  const isChoreographer = user.status === 'choreographer';
  //TK: Identify which team displays when user logs in (currently first one)
  const [selectedTeam, setSelectedTeam] = useState(user.teams[0]);

  const handleSelectTeam = team => {
    setSelectedTeam(team);
  };

  ///THIS IS IN HERE JUST IN CASE USER NOT PULLED IN FROM STATE
  if (!user) {
    return <h3>Unexpected error! You do not exist!</h3>;
  } else {
    return (
      <Grid>
        <Grid.Column width={5}>
          <DashSidebar
            user={user}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            handleSelectTeam={handleSelectTeam}
          />
        </Grid.Column>
        <Grid.Column width={11}>
          {/* <Team team={selectedTeam} /> */}
          <h3>Team will go here</h3>
        </Grid.Column>
      </Grid>
    );
  }
};

export default Dashboard;
