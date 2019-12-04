import axios from 'axios';

// action constants
// const GET_PRACTICES = 'GET_PRACTICES';
// const GET_PRACTICE = 'GET_PRACTICE';
const ADD_PRACTICE = 'ADD_PRACTICE';

// action creators
// const getPractices = practices => ({
//   type: GET_PRACTICES,
//   practices
// });

// const getPractice = practice => ({
//   type: GET_PRACTICE,
//   practice
// });

const addPractice = practice => ({
  type: ADD_PRACTICE,
  practice
});

// thunks
export const addPracticeThunk = (
  recordedData,
  title,
  routineId,
  userId,
  calibration,
  grade
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

    var formData = new FormData();
    formData.append('file', recording, recording.name);
    formData.append('upload_preset', 'acrhvgee');
    // console.log('upload recording ' + recording.name + ' to ' + serverUrl);

    // start upload calibration
    const calibUpload = await axios.post(imageServerUrl, calibrationFormData);
    console.log('calibration uploaded', calibUpload);

    // start upload video
    const upload = await axios.post(serverUrl, formData);
    console.log('upload', upload);
    // Docs: https://cloudinary.com/documentation/upload_videos

    const uploadUrl = upload.data.url.split('.');
    uploadUrl[uploadUrl.length - 1] = 'mp4';
    const fixedUrl = uploadUrl.join('.');

    const newPractice = {
      url: fixedUrl,
      title,
      routineId,
      userId,
      grade
    };

    //SETTING GRADE TO ZERO FOR NOW
    const {data} = await axios.post('/api/practices', newPractice);

    // pass calibration image and routine ID to add new row + generate skelly
    const res = await axios.post('/api/calibration', {
      url: calibUpload.data.url,
      practiceId: data.id
    });
    console.log('calibration skelly', res);

    dispatch(addPractice(data));
  } catch (err) {
    console.log(err);
  }
};

// initial state - array of all practices (in a routine)
const initialState = [];

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRACTICE:
      return [...state, action.practice];
    default:
      return state;
  }
};

// export
export default reducer;
