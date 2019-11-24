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

// initial state
const initialState = {
  routine: {},
  team: {},
  completed: false
};

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSIGNMENTS:
    ///THIS GOES CONSTANTLY; I"M NOT SURE WHY....
    // return {...state, assignment: action};
    // return state;
    default:
      return state;
  }
};

// export
export default reducer;
