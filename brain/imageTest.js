const {canvasify, getPose, getAngles, angleDifferences} = require('../utils');
const path = require('path');

const init = async () => {
  const pose = await getPose(
    await canvasify(path.join(__dirname, 'image1.jpg'))
  );

  const targetPose = await getPose(
    await canvasify(path.join(__dirname, 'image2.jpg'))
  );

  console.log(angleDifferences(pose, targetPose));
};
init();
