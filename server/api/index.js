const router = require('express').Router();
module.exports = router;

// router.use('/videos', require('./videos'));
router.use('/users', require('./users'));
router.use('/teams', require('./teams'));
router.use('/routines', require('./routines'));
router.use('/practices', require('./practices'));
router.use('/assignments', require('./assignments'));
router.use('/calibration', require('./calibration'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
