import axios from 'axios';

// action constants
const GET_ROUTINES = 'GET_ROUTINES';
const ADD_ROUTINE = 'ADD_ROUTINE';

// action creators
// const getRoutines = routines => ({
//   type: GET_ROUTINES,
//   routines
// });

const addRoutine = routine => ({
  type: ADD_ROUTINE,
  routine
});

// thunks
// export const fetchRoutines = teamId => async dispatch => {
//   const {data} = await axios.get(`/api/routines/${teamId}`);
//   dispatch(getRoutines(data));
// };

export const addRoutineThunk = (
  recordedData,
  title,
  teamId,
  userId
) => async dispatch => {
  const serverUrl = 'https://api.cloudinary.com/v1_1/braindance/video/upload';
  var recording = recordedData;

  try {
    var formData = new FormData();
    formData.append('file', recording, recording.name);
    formData.append('upload_preset', 'acrhvgee');
    // console.log('upload recording ' + recording.name + ' to ' + serverUrl);

    // start upload
    const upload = await axios.post(serverUrl, formData);

    // Docs: https://cloudinary.com/documentation/upload_videos
    const newRoutine = {
      url: upload.url,
      title,
      teamId,
      userId
    };

    const {data} = await axios.post('/api/routines', newRoutine);

    dispatch(addRoutine(data));
  } catch (err) {
    console.log(err);
  }
};

// initial state - array of all routines (in a team)
const initialState = [];

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROUTINES:
      return action.routines;
    case ADD_ROUTINE:
      return [...state, action.routine];
    default:
      return state;
  }
};

// export
export default reducer;
