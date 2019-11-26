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
  // add row in Routines table
  const newRoutine = await Routine.create(req.body);
  // ^ not super secure - any way to make this secure while staying dry?

  // initiate server side skelly processor
  const generatedSkellies = generateWireframes(req.body.url);

  await Promise.all(
    generatedSkellies.forEach(skelly => {
      Videoframe.create(skelly);
    })
  );

  res.json(newRoutine);
});

router.put('/', async (req, res, next) => {
  res.send();
});

router.delete('/', async (req, res, next) => {
  res.send();
});
