import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_SINGLE_TEAM = 'SET_SINGLE_TEAM';

/**
 * INTITIAL STATE
 */
const singleTeam = {};

/**
 * ACTION CREATORS
 */
const setSingleTeam = team => ({SET_SINGLE_TEAM, team});

/**
 * THUNK CREATORS
 */
export const getSingleTeam = teamId => async dispatch => {
  try {
    const {data} = await axios.get(`/team/${teamId}`);
    dispatch(setSingleTeam(data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default (state = singleTeam, action) => {
  switch (action.type) {
    case SET_SINGLE_TEAM:
      return action.team;
    default:
      return state;
  }
};
