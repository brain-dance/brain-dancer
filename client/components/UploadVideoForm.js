import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Button, Form, Icon, Modal} from 'semantic-ui-react';
import {addRoutineThunk} from '../store';
import LoadingScreen from './LoadingScreen';

const UploadVideoForm = props => {
  const {blob, teamId, userId} = props;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isClickedSelectVid, setIsClickedSelectVid] = useState(false);
  const [isClickedClose, setIsClickedClose] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const dispatch = useDispatch();

  const handleSelectVid = e => {
    setOpen(!open);
    setIsClickedSelectVid(!isClickedSelectVid);
  };

  const handleClickClose = () => {
    setOpen(!open);
    setIsClickedClose(!isClickedClose);
  };

  const addRoutine = () => {
    dispatch(addRoutineThunk(blob, title, teamId, userId));
  };

  const upload = () => {
    addRoutine(blob, title, teamId, userId);
  };

  const handleUpload = () => {
    upload();
    setIsUploaded(true);
    // setTimeout(handleClickClose(), 10000);
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
      <Modal.Header>Submit Your Routine</Modal.Header>
      {!isUploaded ? (
        <div>
          <Form>
            <Form.Field>
              <label> Give your routine a title.</label>
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
          {/* <Message
            header="Video submitted!"
            content="Video processing. Check back soon :)"
          /> */}
          <LoadingScreen />
        </div>
      )}
    </Modal>
  );
};

export default UploadVideoForm;
