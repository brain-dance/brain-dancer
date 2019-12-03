import axios from 'axios';

// action constants
const SET_SINGLE_ROUTINE = 'SET_SINGLE_ROUTINE';
const ADD_ASSIGNMENT = 'ADD_ASSIGNMENT';
const REMOVE_ASSIGNMENT = 'REMOVE_ASSIGNMENT';

// action creators
export const setSingleRoutine = routine => ({
  type: SET_SINGLE_ROUTINE,
  routine
});

const addAssignment = assignment => ({type: ADD_ASSIGNMENT, assignment});

const removeAssignment = assignmentId => ({
  type: REMOVE_ASSIGNMENT,
  assignmentId
});

// thunks
export const getSingleRoutine = routineId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/routines/${routineId}`);
    dispatch(setSingleRoutine(data));
  } catch (err) {
    console.log(err);
  }
};

export const postAssignment = (userId, routineId) => async dispatch => {
  const {data} = await axios.post('/api/assignments', {userId, routineId});
  if (data[1]) dispatch(addAssignment(data[0]));
};

export const deleteAssignment = assignmentId => async dispatch => {
  try {
    await axios.delete(`/api/assignments/${assignmentId}`);
    dispatch(removeAssignment(assignmentId));
  } catch (err) {
    console.log(err);
  }
};

// initial state
const initialState = {};

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_ROUTINE:
      return action.routine;
    case ADD_ASSIGNMENT:
      return {...state, assignments: [...state.assignments, action.assignment]};
    case REMOVE_ASSIGNMENT:
      return {
        ...state,
        assignments: state.assignments.filter(
          assignment => assignment.id !== +action.assignmentId
        )
      };
    default:
      return state;
  }
};

// export
export default reducer;
