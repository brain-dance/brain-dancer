import axios from 'axios';

// action constants
const GET_USER_ASSIGNMENTS = 'GET_USER_ASSIGNMENTS';

// action creators
const getUserAssignments = assignments => ({
  type: GET_USER_ASSIGNMENTS,
  assignments
});

// thunks
export const fetchUserAssignments = () => async dispatch => {
  const {data} = await axios.get('/api/assignments');
  dispatch(getUserAssignments(data));
};

// initial state
const initialState = [];

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_ASSIGNMENTS:
      return [...state.assignments, action.assignments];
    default:
      return state;
  }
};

// export
export default reducer;
