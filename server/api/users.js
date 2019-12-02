const router = require('express').Router();
const {User, Video, Team} = require('../db/models');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [{model: Team}],
      attributes: ['id', 'name', 'email']
    });
    res.send(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{model: Team}, {model: Video}]
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const user = await User.update(req.body.user, {
      where: {
        id: req.params.id
      }
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await User.destroy({
      where: {id: req.params.id}
    });
    res.status.send(204).end();
  } catch (err) {
    next(err);
  }
});
