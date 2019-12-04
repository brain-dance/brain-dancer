const router = require('express').Router();
const {
  Routine,
  User,
  Assignment,
  Practice,
  VideoFrame,
  CalibrationFrame
} = require('../db/models');
module.exports = router;

const {generateWireframes} = require('../../utils/videoProcessing');

router.get('/', async (req, res, next) => {
  res.send();
});

router.get('/:id', async (req, res, next) => {
  /**
   * routine should include:
   *  choreographer
   *  videoframes
   *  assignments
   *  calibrator videoframe
   *  practices
   */
  try {
    console.log(
      `In GET route, included entities are User: ${typeof User}; Routine: ${typeof Routine}, Assignment: ${typeof Assignment}; Team: ${typeof Team}, vd: ${typeof VideoFrame}`
    );
    const routine = await Routine.findByPk(req.params.id, {
      include: [
        {
          model: User
        },
        {
          model: VideoFrame
        },
        {
          model: Practice
        },
        {
          model: Assignment,
          include: [
            {
              model: User
            }
          ]
        },
        {model: CalibrationFrame}
      ],
      order: [[{model: VideoFrame}, 'frameNumber']]
    });

    res.json(routine);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // add row in Routines table
    const newRoutine = await Routine.create({
      url: req.body.url,
      title: req.body.title,
      teamId: req.body.teamId,
      userId: req.body.userId
    });

    res.json(newRoutine);

    // initiate server side skelly processor
    const generatedSkellies = await generateWireframes(req.body.url);

    await Promise.all(
      generatedSkellies.map((skelly, i) => {
        return VideoFrame.create({
          pose: skelly,
          routineId: newRoutine.id,
          frameNumber: i
        });
      })
    );
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  res.send();
});

router.delete('/', async (req, res, next) => {
  res.send();
});
