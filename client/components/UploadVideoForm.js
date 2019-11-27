import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  Button,
  Card,
  Form,
  Icon,
  Message,
  Modal,
  Segment
} from 'semantic-ui-react';
import {addRoutineThunk} from '../store';

const UploadVideoForm = props => {
  const {blob, teamId, userId} = props;
  const [open, setOpen] = useState(false);
  const [dimmer, setDimmer] = useState(true);
  const [title, setTitle] = useState('');
  const [isClickedSelectVid, setIsClickedSelectVid] = useState(false);
  const [isClickedClose, setIsClickedClose] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const dispatch = useDispatch();

  const handleSelectVid = () => {
    setDimmer(true);
    setOpen(!open);
    setIsClickedSelectVid(!isClickedSelectVid);
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
  };

  // const download = () => {
  //   this.player.record().saveAs({video: 'video-name.webm'});
  // };

  // const handleDownload = (e, {name}) => {
  //   let blobForDownload = recording.find(vid => vid.name === name); //video = blob
  //   download(blobForDownload);
  //   console.log('Handled Download ... Maybe even worked!');
  // };

  const handleClickClose = () => {
    setOpen(!open);
    setIsClickedClose(!isClickedClose);
  };

  return (
    <Modal
      trigger={
        <Button
          labelPosition="right"
          icon="right chevron"
          content="Select Video for Upload"
          name={blob.name}
          onClick={handleSelectVid}
        />
      }
      dimmer={dimmer}
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
          <Message
            header="Video submitted!"
            content="Video processing. Check back soon :)"
          />
        </div>
      )}
    </Modal>
  );
};

export default UploadVideoForm;
