/**
 * Workaround function - used to stop all of a video node's tracks.
 * @param {node} videoNode
 */
export const stopWebcam = videoNode => {
  const stream = videoNode.srcObject;
  const tracks = stream.getTracks();

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    track.stop();
  }

  videoNode.srcObject = null;
};
