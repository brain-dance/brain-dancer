// iterate thru keypoints array

// if we do it this way, we can export an object that has keys as body parts, and values as the objects returned from keypoints (position (x,y), part, and score (confidence))
// const objectOfThisOneFrame = {}
// keypoints.forEach(point=> {
//   objectOfThisOneFrame[point.part] = keypoints[point.part]
// })

var video = document.querySelector('#video');
if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({video: true})
    .then(function(stream) {
      video.srcObject = stream;
    })
    .catch(function(error) {
      console.log('Something went wrong!', error);
    });
}
