const scaling = require('./scaling');
const formatting = require('./formatting');
const posenet = require('./posenet');
const videoProcessing = require('./videoProcessing');

module.exports = {
  ...scaling,
  ...formatting,
  ...posenet,
  ...videoProcessing
};
