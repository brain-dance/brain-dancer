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
import SubmissionMessage from './SubmissionMessage';

const UploadVideoForm = props => {
  const {blob, blobSrc, teamId, userId} = props;
  const [title, setTitle] = useState('');
  const [visible, setVisible] = useState(false);
  const [isClickedSelectVid, setIsClickedSelectVid] = useState(false);
  const [isClickedClose, setIsClickedClose] = useState(false);
  const [open, setOpen] = useState(false);
  const [dimmer, setDimmer] = useState(true);
  const [isUploaded, setIsUploaded] = useState(false);
  const dispatch = useDispatch();

  const handleClickClose = () => {
    setOpen(!open);
    setIsClickedClose(!isClickedClose);
  };

  const addRoutine = () => {
    dispatch(addRoutineThunk(blob, title, teamId, userId));
  };

  const upload = () => {
    addRoutine(blob, title, teamId, userId);
    console.log('TCL: upload -> blob', blob);
    console.log('Added routine');
    setVisible(true);
  };

  // const download = () => {
  //   this.player.record().saveAs({video: 'video-name.webm'});
  // };

  const handleUpload = e => {
    // let blobForUpload = recording.find(vid => vid.name === name);
    // console.log('TCL: handleUpload -> blobForUpload', blobForUpload.name);
    upload();
    setIsUploaded(true);
    console.log('handled upload .... and maybe even uploaded video!');
  };

  const handleSelectVid = () => {
    setDimmer(true);
    setOpen(!open);
    setIsClickedSelectVid(!isClickedSelectVid);
  };
  // const handleDownload = (e, {name}) => {
  //   let blobForDownload = recording.find(vid => vid.name === name); //video = blob
  //   download(blobForDownload);
  //   console.log('Handled Download ... Maybe even worked!');
  // };

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
          <Button content="Submit" onClick={handleUpload} />{' '}
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
