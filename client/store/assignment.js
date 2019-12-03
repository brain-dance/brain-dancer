import axios from 'axios';

// action constants
const GET_ASSIGNMENTS = 'GET_ASSIGNMENTS';
const SUBMIT_ASSIGNMENT = 'SUBMIT_ASSIGNMENT';

// action creators
const getAssignments = assignments => ({
  type: GET_ASSIGNMENTS,
  assignments
});

const submitAssignment = assignment => ({
  type: SUBMIT_ASSIGNMENT,
  assignment
});

// thunks
export const fetchAssignments = () => async dispatch => {
  const {data} = await axios.get('/api/assignments');
  dispatch(getAssignments(data));
};

export const submitAssignmentThunk = (
  blob,
  routineId,
  userId
) => async dispatch => {
  console.log('MADE IT TO THIS THUNK!');
  console.log('TCL: userId', userId);
  console.log('TCL: routineId', routineId);
  console.log('TCL: blob', blob);

  const {data} = await axios.post('/api/assignments/:routineId', {
    assignment: blob,
    routineId: routineId,
    userId: userId
  });
  console.log('TCL: data', data);
  dispatch(submitAssignment(data));
};

// initial state (array of objects {routine, team, completed})
const initialState = [];

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSIGNMENTS:
      return action.assignments;
    case SUBMIT_ASSIGNMENT:
      return [...state, action.assignment];
    default:
      return state;
  }
};

// export
export default reducer;
