import axios from 'axios';

// ACTION CONSTANTS
const GET_ALL_TEAMS = 'GET_ALL_TEAMS';
const GET_USER_TEAMS = 'GET_USER_TEAMS';
const GET_SINGLE_TEAM = 'GET_SINGLE_TEAM';
const ADD_TEAM = 'ADD_TEAM';
const UPDATE_TEAM = 'UPDATE_TEAM';
const DELETE_TEAM = 'DELETE_TEAM';

// ACTION CREATORS
const getUserTeams = teams => ({
  type: GET_USER_TEAMS,
  teams
});

const addTeam = team => ({
  type: ADD_TEAM,
  team
});

const updateTeam = team => ({
  type: UPDATE_TEAM,
  team
});

const deleteTeam = teamId => ({
  type: DELETE_TEAM,
  teamId
});

// THUNKS
export const fetchTeams = () => async dispatch => {
  const {data} = await axios.get('/api/teams');
  dispatch(getUserTeams(data));
};

export const fetchUserTeams = () => async dispatch => {
  const {data} = await axios.get(`/api/teams`);

  dispatch(getUserTeams(data));
};

export const addTeamThunk = teamBody => async dispatch => {
  const {data} = await axios.post('/api/teams', teamBody);
  dispatch(addTeam(data));
};

export const updateTeamThunk = (teamId, teamBody) => async dispatch => {
  const {data} = await axios.put(`/api/teams/${teamId}`, teamBody);
  dispatch(updateTeam(data));
};

export const deleteTeamThunk = teamId => async dispatch => {
  await axios.delete(`/api/teams/${teamId}`);
  dispatch(deleteTeam(teamId));
};

// INITIAL STATE
const teams = [];

// REDUCER
const reducer = (state = teams, action) => {
  switch (action.type) {
    case GET_ALL_TEAMS:
      return action.teams;
    case GET_USER_TEAMS:
      return action.teams;
    case GET_SINGLE_TEAM:
      return {...state, activeTeam: action.team};
    case ADD_TEAM:
      //adds to team AND sets as active team
      return [...state, action.team];
    case UPDATE_TEAM:
      return state.map(team => {
        if (team.id === +action.team.id) {
          return action.team;
        } else {
          return team;
        }
      });

    case DELETE_TEAM:
      return state.list.filter(team => team.id !== +action.teamId);

    default:
      return state;
  }
};

// EXPORT
export default reducer;
