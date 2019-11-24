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
  const {data} = await axios.get('/api/routines');
  dispatch(getAssignments(data));
};

// initial state
const initialState = [
  {
    routine: {},
    team: {},
    completed: false
  }
];

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSIGNMENTS:
      return {...state, assignments: action.assignments};
    default:
      return state;
  }
};

// export
export default reducer;
