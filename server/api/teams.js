const router = require('express').Router();
const {Team} = require('../db/models');
module.exports = router;

// /api/teams route

//get all teams
router.get('/', async (req, res, next) => {
  try {
    const allTeams = await Team.findAll();
    res.json(allTeams);
  } catch (err) {
    next(err);
  }
});

//get team by id
router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const team = await Team.findByPk(id);
    res.json(team);
  } catch (err) {
    next(err);
  }
});

//add new team
router.post('/', async (req, res, next) => {
  try {
    const {name, description, category} = req.body;
    const newTeam = await Team.create({name, description, category});
    res.status(200).json(newTeam);
  } catch (err) {
    next(err);
  }
});

// update team (name, etc)
router.put('/:id', async (req, res, next) => {
  try {
    const {name, description, category} = req.body;
    await Team.update(
      {name, description, category},
      {where: {id: req.params.id}, returning: true}
    );
    const updatedTeam = Team.findByPk(req.params.id);
    res.status(201).json(updatedTeam);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    await Video.destroy({where: {id: id}});
    //NOTE: This will only delete Postgres entry; not video in Cloudinary
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
