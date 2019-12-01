import React, {useState} from 'react';
import {Button, Card, Header, Icon} from 'semantic-ui-react';
import UploadVideoForm from './UploadVideoForm';

const PrevAttempts = props => {
  let {recording, handleDelete, teamId, userId} = props;

  const [isSelected, setIsSelected] = useState({});
  let attempt = 0;

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
          <div id="previous-attempt" key={blob.name}>
            <Card>
              <Button.Group vertical>
                <Button
                  icon
                  name={blob.name}
                  onClick={handleDelete}
                  color="black"
                  attached="top"
                  size="mini"
                  float="right"
                >
                  <Icon name="delete" />
                </Button>
                <Button
                  color={selected ? 'blue' : 'black'}
                  type="button"
                  key={blob.name}
                  name={blob.name}
                  onClick={handleSelect}
                >
                  <video controls id={blob.name} width="200" src={blobSrc} />
                </Button>
                <UploadVideoForm
                  attached="bottom"
                  blob={blob}
                  teamId={teamId}
                  userId={userId}
                />
              </Button.Group>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default PrevAttempts;
