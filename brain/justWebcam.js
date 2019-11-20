// iterate thru keypoints array

// if we do it this way, we can export an object that has keys as body parts, and values as the objects returned from keypoints (position (x,y), part, and score (confidence))
// const objectOfThisOneFrame = {}
// keypoints.forEach(point=> {
//   objectOfThisOneFrame[point.part] = keypoints[point.part]
// })

var video = document.getElementsByTagName(video);

// const getPermission = async () => {
//   const permission = await navigator.mediaDevices.getUserMedia();
//   return permission;
// };
if (navigator.mediaDevices.getUserMedia) {
  console.log(navigator);
  console.log(navigator.mediaDevices);
  navigator.mediaDevices
    .getUserMedia({video: true})
    .then(function(stream) {
      video.srcObject = stream;
    })
    .catch(function(error) {
      console.log('Something went wrong!', error);
    });
}
