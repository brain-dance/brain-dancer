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
  const {blob, blobSrc, teamId, userId} = props;
  const [title, setTitle] = useState('');
  const [visible, setVisible] = useState(false);
  const [isClickedSelectVid, setIsClickedSelectVid] = useState(false);

  const [isClickedClose, setIsClickedClose] = useState(false);
  const [open, setOpen] = useState(false);
  const [dimmer, setDimmer] = useState(true);
  const dispatch = useDispatch();

  const handleDismiss = () => {
    setVisible(false);
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
          content="Select Video"
          name={blob.name}
          onClick={handleSelectVid}
        >
          {/* <Icon name="upload" /> */}
        </Button>
      }
      dimmer={dimmer}
      open={open}
      onClose={handleClickClose}
    >
      <Button floated="right" type="icon" onClick={handleClickClose}>
        <Icon name="window close" />
      </Button>
      <Modal.Header>Submit your video</Modal.Header>
      {/* <Segment compact> */}
      <Form>
        <Form.Field>
          <label>Give your routine a title!</label>
          <input
            value={title}
            onChange={evt => {
              setTitle(evt.target.value);
            }}
          />
        </Form.Field>
      </Form>
      <p>When you are ready, submit your video for processing!</p>
      <Button content="Submit" onClick={handleUpload} />
      {/* <Button content="Download" onClick={this.download} /> */}
      {visible ? (
        <Message
          onDismiss={handleDismiss}
          header="Video submitted!"
          content="Video processing. Check back soon :)"
        />
      ) : (
        ''
      )}
      {/* </Segment> */}
    </Modal>
  );
};

export default UploadVideoForm;
