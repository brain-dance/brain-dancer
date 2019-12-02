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
  userId,
  calibration
) => async dispatch => {
  const imageServerUrl =
    'https://api.cloudinary.com/v1_1/braindance/image/upload';
  const serverUrl = 'https://api.cloudinary.com/v1_1/braindance/video/upload';
  var recording = recordedData;
  try {
    // info to upload calibration image
    // var calibrationFormData = new FormData();
    // calibrationFormData.append('file', calibration);
    // calibrationFormData.append('upload_preset', 'acrhvgee');
    const calibrationFormData = {
      file: calibration,
      upload_preset: 'acrhvgee'
    };
    console.log('calibrationformdata', calibrationFormData);

    // info to upload video
    var formData = new FormData();
    formData.append('file', recording, recording.name);
    formData.append('upload_preset', 'acrhvgee');
    // console.log('upload recording ' + recording.name + ' to ' + serverUrl);

    // start upload
    const calibUpload = await axios.post(imageServerUrl, calibrationFormData);
    console.log('calibration uploaded', calibUpload);

    const upload = await axios.post(serverUrl, formData);
    console.log('upload', upload);
    const uploadUrl = upload.data.url.split('.');
    uploadUrl[uploadUrl.length - 1] = 'mp4';
    const fixedUrl = uploadUrl.join('.');

    // Docs: https://cloudinary.com/documentation/upload_videos

    const newRoutine = {
      url: fixedUrl,
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
