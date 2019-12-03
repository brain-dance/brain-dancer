const router = require('express').Router();
const {Assignment, Practice, Routine, Team} = require('../db/models');
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
    const assignment = await Assignment.findOrCreate({
      where: {userId, routineId},
      defaults: {completed: false}
    });

    res.send(assignment);
  } catch (err) {
    next(err);
  }
});

router.put('/:routineId', async (req, res, next) => {
  try {
    const {id} = req.user;
    await Assignment.update(
      {completed: true},
      {
        where: {
          userId: id,
          routineId: req.params.routineId
        }
      }
    );

    const updatedAssignment = await Assignment.findOne({
      where: {userId: id, routineId: req.params.routineId}
    });

    //SEND TITLE, URL, GRADE
    // await Practice.create({title, url, grade, routineId, userId});

    //QUERY: what do we send back (if anything?)
    res.status(201).send(updatedAssignment);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Assignment.destroy({
      where: {
        id: req.params.id
      }
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});
