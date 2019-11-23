import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button, Header, List} from 'semantic-ui-react';
import {getUser} from '../store/user';

/**
 * COMPONENT
 */
export const UserHome = props => {
  const user = useSelector(state => state.user);
  const isChoreographer = user.status === 'choreographer';
  const dispatch = useDispatch();
  ///PUT TEAMS ON THE STATE and/or PROPS

  // useEffect(() => {
  //   dispatch(getUser());
  // }, []);

  //OR do we want to getTeams instead?

  return (
    <div>
      <Header as="h1">Welcome, {user.name}!</Header>
      <div>
        <Header>My DanceTeams</Header>
        {user.teams.map(team => {
          return (
            <List key={team.id}>
              <List.Item>
                <List.Header>{team.name}</List.Header>DESCRIPTION
              </List.Item>
            </List>
          );
        })}
      </div>
      <Button type="submit">Add Video</Button>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  };
};

export default connect(mapState)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
};
