import React, {useState} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
import {Header, Segment, Grid} from 'semantic-ui-react';
import TeamList from './TeamList';
import Assignments from './Assignments';

export const DashSidebar = props => {
  const {teams, selectedTeam, handleSelectTeam} = props;
  const {assignments} = props;
  console.log('TCL: assignments', assignments);

  return teams.length ? (
    <div>
      <Header as="h3">Assignments</Header>
      <Assignments assignments={assignments} />
      <Grid>
        <Grid.Column width={3}>
          <Header as="h3">Teams</Header>
        </Grid.Column>
        <Grid.Column width={1}>
          {/* BUTTON MIGHT MOVE TO ADD TEAM MODAL */}
          {/* <Button size="mini" color="olive" icon onClick={handleClickAddTeam}>
            <Icon name="add square" />
          </Button> */}
        </Grid.Column>
      </Grid>
      <TeamList
        teams={teams}
        selectedTeam={selectedTeam}
        handleSelectTeam={handleSelectTeam}
      />
    </div>
  ) : (
    <h3>Error!</h3>
  );
};

export default DashSidebar;
