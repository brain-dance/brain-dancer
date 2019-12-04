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
    const calibrationFormData = {
      file: calibration,
      upload_preset: 'acrhvgee'
    };

    // info to upload video
    var formData = new FormData();
    formData.append('file', recording, recording.name);
    formData.append('upload_preset', 'acrhvgee');
    // console.log('upload recording ' + recording.name + ' to ' + serverUrl);

    // start upload calibration
    const calibUpload = await axios.post(imageServerUrl, calibrationFormData);
    console.log('calibration uploaded', calibUpload);

    // start upload video
    const upload = await axios.post(serverUrl, formData);
    console.log('video uploaded', upload);
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

    // get new routine to use routine ID for calibration
    const {data} = await axios.post('/api/routines', newRoutine);

    // pass calibration image and routine ID to add new row + generate skelly
    const res = await axios.post('/api/calibration', {
      url: calibUpload.data.url,
      routineId: data.id
    });
    console.log('calibration skelly', res);

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
