import axios from 'axios';

// action constants
const GET_ASSIGNMENTS = 'GET_ASSIGNMENTS';
export const ADD_ASSIGNMENT = 'ADD_ASSIGNMENT';

// action creators
const getAssignments = assignments => ({
  type: GET_ASSIGNMENTS,
  assignments
});

const addAssignment = assignment => ({type: ADD_ASSIGNMENT, assignment});

export const postAssignment = assignment => async dispatch => {
  const {data} = await axios.post('/api/assignments', assignment);
  dispatch(addAssignment(data));
};

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
