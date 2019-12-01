import React, {useEffect} from 'react';
import {Dimmer, Loader, Message, Segment} from 'semantic-ui-react';

const LoadingScreen = props => {
  const {isUploaded, setIsUploaded} = props;

  useEffect(() => {
    setTimeout(function() {
      setIsUploaded(true);
    }, 10000);
    ///make this wait 10 seconds.
    console.log('TCL: isUploaded', isUploaded);
  });

  return !isUploaded ? (
    <div>
      <Segment>
        <Dimmer active>
          <Loader inverted size="mini">
            Uploading Video
          </Loader>
        </Dimmer>
      </Segment>
    </div>
  ) : (
    <Message
      header="Success!"
      content="Your video has been uploaded, but it will take a few minutes to process that 5-star routine. We'll email you a link when it's done! [Or something like that....]"
    />
  );
};

export default LoadingScreen;
