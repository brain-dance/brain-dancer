import axios from 'axios';

// action constants
export const SET_SINGLE_ROUTINE = 'SET_SINGLE_ROUTINE';

// action creators
const setSingleRoutine = routine => ({type: SET_SINGLE_ROUTINE, routine});

// thunks
export const getSingleRoutine = routineId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/routines/${routineId}`);
    dispatch(setSingleRoutine(data));
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
    default:
      return state;
  }
};

// export
export default reducer;
