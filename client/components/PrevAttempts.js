import React, {useState, useEffect} from 'react';
import {Button, Card, Header, Icon} from 'semantic-ui-react';

const PrevAttempts = props => {
  let {recording, handleDelete} = props;

  const handleRewatch = (e, {name}) => {
    let video = document.getElementById(name);
    video.play();
  };

  const handlePause = (e, {name}) => {
    let video = document.getElementById(name);
    video.pause();
  };

  return !recording.length ? (
    <Header as="h3">Ready to get started? Record a video!</Header>
  ) : (
    <div>
      <Header as="h3">Recorded Attempts</Header>
      {recording.map(blob => {
        let blobSrc = URL.createObjectURL(blob);
        return (
          <Card fluid key={blob.name}>
            <Card.Content>
              <video id={blob.name} width="200" src={blobSrc} />
            </Card.Content>
            {/* <Card.Content extra> */}
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
          </Card>
        );
      })}
    </div>
  );
};

export default PrevAttempts;
