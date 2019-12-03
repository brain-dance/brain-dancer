import axios from 'axios';

// action constants
const GET_ASSIGNMENTS = 'GET_ASSIGNMENTS';

// action creators
const getAssignments = assignments => ({
  type: GET_ASSIGNMENTS,
  assignments
});

// thunks
export const fetchAssignments = () => async dispatch => {
  const {data} = await axios.get('/api/assignments');
  dispatch(getAssignments(data));
};

// initial state (array of objects {routine, team, completed})
const initialState = [];

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSIGNMENTS:
      return action.assignments;
    default:
      return state;
  }
};

// export
export default reducer;
