import axios from 'axios';

// action constants
const GET_PRACTICES = 'GET_PRACTICES';
const GET_PRACTICE = 'GET_PRACTICE';
const ADD_PRACTICE = 'ADD_PRACTICE';

// action creators
const getPractices = practices => ({
  type: GET_PRACTICES,
  practices
});

const getPractice = practice => ({
  type: GET_PRACTICE,
  practice
});

const addPractice = practice => ({
  type: ADD_PRACTICE,
  practice
});

// thunks
// const fetchPractices = routineId => async dispatch => {
//   const { data } = await axios.get()
// }

const addPracticeThunk = teamId, routineId

// initial state - array of all practices (in a routine)
const initialState = [];

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// export
export default reducer;
