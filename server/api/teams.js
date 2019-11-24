const router = require('express').Router();
const {Team, User, Routine} = require('../db/models');
module.exports = router;

// /api/teams route

//get all teams a user belongs to
router.get('/', async (req, res, next) => {
  try {
    let {id} = req.user;

    const teamIds = await User.findByPk(id, {
      include: {model: Team}
    }).then(user => user.teams.map(team => team.id));

    let allTeams = await Team.findAll({
      include: [{model: User}, {model: Routine}],
      where: {
        id: teamIds
      }
    });

    allTeams = allTeams.map(team => team.toJSON());

    res.json(
      allTeams.map(team => {
        team.members = team.users;
        delete team.users;
        return team;
      })
    );
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

//remove a team (should be admin?)
router.delete('/:id', async (req, res, next) => {
  try {
    //check if logged in user is choreographer and belongs on team
    // const reqUserTeams = await User.findByPk(req.user.id, {include: [{model: Team}]})
    // const belongsToTeam = reqUserTeams.teams.filter(team=>{
    //   team.id === req.params.id
    // })
    // if (req.user.status === 'choreographer' && belongsToTeam.length > 0)
    // {
    const {id} = req.params;
    await Team.destroy({where: {id: id}});
    res.status(204).end();
    // }
  } catch (err) {
    next(err);
  }
});
