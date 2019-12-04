import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Grid, Modal} from 'semantic-ui-react';
import DashSidebar from './Dash_Sidebar';
import Team from './Team';
import {
  RecordPractice,
  RecordRoutine,
  Choreo,
  Assignments,
  WatchRoutine
} from './index';
import {deleteTeamMemberThunk} from '../store';
import AddTeamForm from './AddTeamForm';
import AddMemberForm from './AddMemberForm';

import {Route, Switch} from 'react-router-dom';

/**
 * COMPONENT
 */
export const Dashboard = props => {
  const teams = useSelector(state => state.teams);
  const dispatch = useDispatch();
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  const handleSelectTeam = team => {
    setSelectedTeam(team);
  };

  const handleUpdateTeam = (teamId, memberId) => {
    dispatch(deleteTeamMemberThunk(teamId, memberId));
    const updatedSelectedTeam = {
      ...selectedTeam,
      members: selectedTeam.members.filter(member => member.id !== memberId)
    };
    setSelectedTeam(updatedSelectedTeam);
  };

  if (!teams || !teams.length) {
    return <h3>Unexpected error! You do not exist!</h3>;
  } else {
    return (
      <Grid id="container">
        <Grid.Column width={3} id="sidebar-container">
          <DashSidebar
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            handleSelectTeam={handleSelectTeam}
            setModalOpen={setModalOpen}
          />
        </Grid.Column>
        <Grid.Column width={13}>
          <Modal dimmer="inverted" open={modalOpen}>
            <Modal.Content>
              <AddTeamForm setModalOpen={setModalOpen} />
            </Modal.Content>
          </Modal>

          <Modal dimmer="inverted" open={memberModalOpen}>
            <Modal.Content>
              <AddMemberForm setMemberModalOpen={setMemberModalOpen} />
            </Modal.Content>
          </Modal>

          <Switch>
            <Route path="/watch/routines/:id" component={WatchRoutine} />
            <Route
              path="/team/:teamId/routine/:routineId/add"
              component={RecordPractice}
            />
            <Route path="/team/:teamId/routine/:routineId" component={Choreo} />
            <Route path="/team/:teamId/add" component={RecordRoutine} />
            <Route exact path="/my-assignments" component={Assignments} />
            <Route
              path="/team/:teamId"
              render={() => (
                <Team
                  setMemberModalOpen={setMemberModalOpen}
                  handleUpdateTeam={handleUpdateTeam}
                />
              )}
            />
            <Route component={Assignments} />
          </Switch>
        </Grid.Column>
      </Grid>
    );
  }
};

export default Dashboard;
