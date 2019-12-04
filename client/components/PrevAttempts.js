import React, {useState} from 'react';
import {Button, Card, Header, Icon} from 'semantic-ui-react';
import UploadVideoForm from './UploadVideoForm';

const PrevAttempts = props => {
  let {recording, handleDelete, teamId, userId, attempts} = props;
  const [isSelected, setIsSelected] = useState({});

  const handleSelect = (e, {name}) => {
    let selectedBlob = recording.find(blob => blob.name === name); //video = blob
    setIsSelected(selectedBlob);
  };

  const handlePlay = (e, {name}) => {
    let selectedVid = document.getElementById(name); //video = blob
    selectedVid.play();
  };

  const handlePause = (e, {name}) => {
    let selectedVid = document.getElementById(name); //video = blob
    selectedVid.pause();
  };

  return !recording.length ? (
    <Header as="h3">Ready to get started? Record a video!</Header>
  ) : (
    <div>
      <Header as="h3">Recorded Attempts</Header>
      {recording.map(blob => {
        let blobSrc = URL.createObjectURL(blob);
        let blobInfo = attempts[blob.name];

        return (
          <div className="vidCard" id="previous-attempt" key={blob.name}>
            <Card name={blob.name} onClick={handleSelect}>
              {blobInfo ? <Card.Meta>{blobInfo.grade / 100}</Card.Meta> : ''}
              <video id={blob.name} width="200" src={blobSrc} />
              <Button.Group>
                <Button name={blob.name} icon onClick={handlePlay}>
                  <Icon name="play" />
                </Button>
                <Button name={blob.name} icon onClick={handlePause}>
                  <Icon name="pause" />
                </Button>
                <Button icon name={blob.name} onClick={handleDelete}>
                  <Icon name="delete" />
                </Button>
              </Button.Group>
              <UploadVideoForm
                attached="bottom"
                blob={blob}
                teamId={teamId}
                userId={userId}
                calibration={props.calibration}
              />
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default PrevAttempts;
