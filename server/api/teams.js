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

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const video = await Video.findByPk(id);
    //NOTE: Sending back the video url + status; not the video file
    res.json(video);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    //NOTE: Will have req.user eventually via passport
    // const {id} = req.user;
    const id = 2;
    //NOTE: Will need thunk to provide teamId
    const {url, status, teamId} = req.body;
    const video = await Video.create({url, status});
    if (id) {
      video.setUser(id);
    }
    if (teamId) {
      video.setTeam(teamId);
    }
    res.status(200).json(video);
    //NOTE: Sends video url + status; doesn't upload to Cloudinary
  } catch (err) {
    next(err);
  }
});

//NOTE: May need PUT later but cannot think of where it fits in user stories

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
