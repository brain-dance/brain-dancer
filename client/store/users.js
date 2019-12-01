import axios from 'axios';

// action constants
const GET_ALL_USERS = 'GET_ALL_USERS';

// action creators
const getAllUsers = users => ({
  type: GET_ALL_USERS,
  users
});

// thunks
export const fetchAllUsers = () => async dispatch => {
  const {data} = await axios.get('/api/users');
  dispatch(getAllUsers(data));
};

// initial state
const initialState = [];

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USERS:
      return action.users;
    default:
      return state;
  }
};

// export
export default reducer;
