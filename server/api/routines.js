const router = require('express').Router();
const {
  Routine,
  User,
  Assignment,
  Practice,
  VideoFrame
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
              model: User //this isn't quite right, need models
            }
          ]
        }
      ]
    });

    res.json(routine);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // add row in Routines table
    const newRoutine = await Routine.create(req.body);
    // ^ not super secure - any way to make this secure while staying dry?

    // initiate server side skelly processor
    const generatedSkellies = generateWireframes(req.body.url);

    await Promise.all(
      generatedSkellies.forEach(skelly => {
        VideoFrame.create(skelly);
      })
    );

    res.json(newRoutine);
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
