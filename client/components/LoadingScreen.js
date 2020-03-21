import React, {useEffect} from 'react';
import {Loader, Message} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const LoadingScreen = props => {
  const {isUploaded, setIsUploaded} = props;

  useEffect(() => {
    setTimeout(function() {
      setIsUploaded(true);
    }, 4000);
  });

  return !isUploaded ? (
    <Message>
      <Message.Content>
        <Message.Header>Just one second</Message.Header>
        <Loader />
        We are uploading your video.
      </Message.Content>
    </Message>
  ) : (
    <Message
      header="Success!"
      content="Your video has been uploaded, but it will take a few minutes to process that 5-star routine. It will show up on your team page soon."
    />
  );
};


export default LoadingScreen;
