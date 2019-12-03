import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Form, Icon, Modal} from 'semantic-ui-react';
import {addRoutineThunk, submitAssignmentThunk} from '../store';
import LoadingScreen from './LoadingScreen';

const UploadVideoForm = props => {
  const {blob, teamId, userId} = props;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isClickedSelectVid, setIsClickedSelectVid] = useState(false);
  const [isClickedClose, setIsClickedClose] = useState(false);
  const [isClickedUpload, setIsClickedUpload] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const dispatch = useDispatch();
  const isAssignedPractice = props.match.params.hasOwnProperty('routineId');

  const handleSelectVid = () => {
    setOpen(!open);
    setIsClickedSelectVid(!isClickedSelectVid);
  };

  const handleClickClose = () => {
    setOpen(!open);
    setIsClickedClose(!isClickedClose);
  };

  const addRoutine = () => {
    dispatch(addRoutineThunk(blob, title, teamId, userId, props.calibration));
  };

  const upload = () => {
    //add assigned practices (submitted by dancers) upon upload
    if (isAssignedPractice) {
      let routineId = +props.match.params.routineId;
      dispatch(submitAssignmentThunk(blob, routineId));
      //ALSO NEEDS TO BE ADDED TO PRACTICE DB
      //COPY *SOME* LOGIC RECORD PRACTICE CALIBRATION -> No longer uploading image; need that to be saved .... pass dataURL...
    } else {
      //add routines submitted by choreographers
      addRoutine(blob, title, teamId, userId, props.calibration);
    }
  };

  const handleUpload = () => {
    setIsClickedUpload(true);
    upload();
  };

  return (
    <Modal
      trigger={
        <Button
          labelPosition="right"
          icon="right chevron"
          color="black"
          content="Upload Video"
          name={blob.name}
          onClick={handleSelectVid}
        />
      }
      dimmer="inverted"
      open={open}
      onClose={handleClickClose}
    >
      <Button floated="right" type="icon" onClick={handleClickClose}>
        <Icon name="window close" />
      </Button>
      <Modal.Header>
        {!isAssignedPractice ? 'Submit Routine' : 'Submit Practice Video'}
      </Modal.Header>
      {!isClickedUpload ? (
        <div>
          <Form>
            <Form.Field>
              {isAssignedPractice ? (
                <label>Give your practice a title.</label>
              ) : (
                <label> Give your routine a title.</label>
              )}
              <input
                value={title}
                onChange={evt => {
                  setTitle(evt.target.value);
                }}
              />
            </Form.Field>
          </Form>
          <p>When you are ready, submit your video for processing!</p>
          <Button
            name={blob.name}
            content="Submit"
            onClick={handleUpload}
          />{' '}
        </div>
      ) : (
        <div>
          <LoadingScreen
            isUploaded={isUploaded}
            setIsUploaded={setIsUploaded}
          />
        </div>
      )}
    </Modal>
  );
};

export default withRouter(UploadVideoForm);
