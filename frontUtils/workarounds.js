export const stopWebcam = videoNode => {
  const stream = videoNode.srcObject;
  const tracks = stream.getTracks();

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    track.stop();
    console.log(track);
  }

  videoNode.srcObject = null;
};
