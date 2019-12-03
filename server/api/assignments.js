const router = require('express').Router();
const {Assignment, Routine, Team, User} = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    let {id} = req.user;
    if (id) {
      //find all user's assignments + team routine belongs to
      const userAssignments = await Assignment.findAll({
        include: [{model: Routine, include: [Team]}],
        where: {userId: id}
      });
      res.send(userAssignments);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {userId, routineId} = req.body;
    const temp = await Assignment.create({
      userId,
      routineId,
      completed: false
    });
    const assignment = await Assignment.findByPk(temp.id, {
      include: {model: User}
    });
    res.send(assignment);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await Assignment.update(
      {completed: true},
      {
        where: {
          userId: req.user.id,
          routineId: req.params.id
        }
      }
    );
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});
