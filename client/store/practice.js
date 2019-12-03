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
  grade
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
    console.log('upload', upload);
    // Docs: https://cloudinary.com/documentation/upload_videos
    const newPractice = {
      url: upload.data.url,
      title,
      routineId,
      userId,
      grade
    };

    const {data} = await axios.post('/api/practices', newPractice);

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
