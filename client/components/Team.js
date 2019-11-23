import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getSingleTeam} from '../store';

const TeamHome = props => {
  const {teamId} = props.match.params;
  const dispatch = useDispatch();

  const users = useSelector(state => state.users);
  const team = useSelector(state => state.singleTeam);

  useEffect(() => {
    dispatch(getSingleTeam(teamId));
  }, []);

  return <h1>Hello</h1>;
};

export default TeamHome;
