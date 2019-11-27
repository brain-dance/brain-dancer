import React, {useState} from 'react';
import {Button, Card, Header, Icon} from 'semantic-ui-react';
import UploadVideoForm from './UploadVideoForm';

const PrevAttempts = props => {
  let {recording, handleDelete, teamId, userId} = props;

  const [isSelected, setIsSelected] = useState({});
  let attempt = 0;

  const handleRewatch = (e, {name}) => {
    let video = document.getElementById(name);
    video.play();
  };

  const handlePause = (e, {name}) => {
    let video = document.getElementById(name);
    video.pause();
  };

  const handleSelect = (e, {name}) => {
    let selectedBlob = recording.find(blob => blob.name === name); //video = blob
    setIsSelected(selectedBlob);
  };

  return !recording.length ? (
    <Header as="h3">Ready to get started? Record a video!</Header>
  ) : (
    <div>
      <Header as="h3">Recorded Attempts</Header>
      {recording.map(blob => {
        let blobSrc = URL.createObjectURL(blob);
        let selected = isSelected.name === blob.name;
        attempt++;

        return (
          <Card fluid key={blob.name}>
            <Button
              basic
              color={selected ? 'orange' : 'grey'}
              type="button"
              key={blob.name}
              name={blob.name}
              onClick={handleSelect}
            >
              <Card.Content>
                <video id={blob.name} width="200" src={blobSrc} />
              </Card.Content>
            </Button>
            <Button.Group icon fluid attached="bottom">
              <Button name={blob.name} onClick={handleRewatch}>
                <Icon name="play" />
              </Button>
              <Button name={blob.name} onClick={handlePause}>
                <Icon name="pause" />
              </Button>
              <Button name={blob.name} onClick={handleDelete}>
                <Icon name="delete" />
              </Button>
            </Button.Group>
            <UploadVideoForm blob={blob} teamId={teamId} userId={userId} />
          </Card>
        );
      })}
    </div>
  );
};

export default PrevAttempts;
