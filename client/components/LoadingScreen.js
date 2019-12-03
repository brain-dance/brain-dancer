import React, {useEffect} from 'react';
import {Dimmer, Loader, Message, Segment} from 'semantic-ui-react';

const LoadingScreen = props => {
  const {isUploaded, setIsUploaded} = props;

  useEffect(() => {
    setTimeout(function() {
      setIsUploaded(true);
    }, 10000);
  });

  return !isUploaded ? (
    <div>
      <Loader>
        <h3>Please wait while we upload your video.</h3>
      </Loader>
    </div>
  ) : (
    <Message
      header="Success!"
      content="Your video has been uploaded, but it will take a few minutes to process that 5-star routine. We'll email you a link when it's done! [Or something like that....]"
    />
  );
};

export default LoadingScreen;
