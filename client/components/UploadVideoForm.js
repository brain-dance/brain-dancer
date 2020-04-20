import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Form, Icon, Modal} from 'semantic-ui-react';
import {
  addRoutineThunk,
  submitAssignmentThunk,
  addPracticeThunk
} from '../store';
import LoadingScreen from './LoadingScreen';
import PropTypes from 'prop-types';

const UploadVideoForm = props => {
  const {blob, teamId, userId, blobInfo} = props;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isClickedSelectVid, setIsClickedSelectVid] = useState(false);
  const [isClickedClose, setIsClickedClose] = useState(false);
  const [isClickedUpload, setIsClickedUpload] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const dispatch = useDispatch();
  const isAssignedPractice = props.match.params.hasOwnProperty('routineId');
  // ^ this means that UploadVideoForm is appearing
  // on a RecordPractice page (as opposed to a RecordRoutine page)
  // and therefore should be treated as a practice

  const handleSelectVid = () => {
    setOpen(!open);
    setIsClickedSelectVid(!isClickedSelectVid);
  };

  const redirectToTeamPage = () => {
    props.history.push(`/team/${teamId}`);
  };

  const handleClickClose = () => {
    setOpen(!open);
    setIsClickedClose(!isClickedClose);
    if (isUploaded) redirectToTeamPage();
  };

  const addRoutine = () => {
    dispatch(addRoutineThunk(blob, title, teamId, userId, props.calibration));
  };

  const addPractice = grade => {
    dispatch(
      addPracticeThunk(blob, title, teamId, userId, props.calibration, grade)
    );
  };

  const upload = () => {
    //add assigned practices submitted by dancers; mark assignment complete
    if (isAssignedPractice) {
      let routineId = +props.match.params.routineId;
      dispatch(submitAssignmentThunk(routineId));
      let grade = blobInfo.grade;
      addPractice(grade);
    } else {
      //add routines submitted by choreographers
      addRoutine();
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

UploadVideoForm.propTypes = {
  teamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userId: PropTypes.number,
  calibration: PropTypes.string
  // other items in props not defined here:
  /**
   * attached
   * blob
   * blobInfo
   * history, location, match
   * staticContext
   */
};

export default withRouter(UploadVideoForm);
