const router = require('express').Router();
const {Routine, User, Assignment, Videoframe} = require('../db/models');
module.exports = router;

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
          model: Videoframe
        },
        {
          model: Assignment,
          include: {
            model: User //this isn't quite right, need models
          }
        }
      ]
    });

    res.json(routine);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  res.send();
});

router.put('/', async (req, res, next) => {
  res.send();
});

router.delete('/', async (req, res, next) => {
  res.send();
});
