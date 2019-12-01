import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Grid, Modal} from 'semantic-ui-react';
import DashSidebar from './Dash_Sidebar';
import Team from './Team';
import {fetchUserTeams} from '../store';
import {fetchAssignments} from '../store/assignment';
import AddTeamForm from './AddTeamForm';
import AddMemberForm from './AddMemberForm';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

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
            setModalOpen={setModalOpen}
          />
        </Grid.Column>
        <Grid.Column width={11}>
          <div>
            <Modal dimmer="inverted" open={modalOpen}>
              <Modal.Content>
                <AddTeamForm setModalOpen={setModalOpen} />
              </Modal.Content>
            </Modal>
          </div>
          <div>
            <Modal dimmer="inverted" open={memberModalOpen}>
              <Modal.Content>
                <AddMemberForm setMemberModalOpen={setMemberModalOpen} />
              </Modal.Content>
            </Modal>
          </div>
          <Team team={selectedTeam} setMemberModalOpen={setMemberModalOpen} />
        </Grid.Column>
      </Grid>
    );
  }
};

export default Dashboard;
