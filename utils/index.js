const formatting = require('./formatting');
const posenet = require('./posenet');
const videoProcessing = require('./videoProcessing');
const scaling = require('./scaling');
const geometry = require('./geometry');

module.exports = {
  ...scaling,
  ...formatting,
  ...posenet,
  ...videoProcessing,
  ...geometry
};
