const faker = require('faker');
const {
  User,
  Team,
  Video,
  CalibrationFrame,
  VideoFrame
} = require('../server/db/models');
const db = require('../server/db/db');
const {green, red, yellowBright} = require('chalk');

const totalSeeds = 100;

//TEST ACCOUNTS - User
const testUsers = [
  {
    name: 'Misty Copeland',
    email: 'misty.copeland@dance.com',
    status: 'choreographer',
    // calibrationModel:,
    password: '12345'
  },
  {
    name: 'Fred Astaire',
    email: 'fred.astaire@dance.com',
    status: 'dancer',
    // calibrationModel:,
    password: '12345'
  }
  //THINK OF EDGE CASES
];

//TEST ACCOUNTS - Team
const testTeams = [
  {name: "Waltzin' Matildas"},
  {name: 'Twinkle Toes'},
  {name: 'TipTop HipHop'}
  //THINK OF EDGE CASES
];

//TEST ACCOUNTS - Video
const testVideos = [
  {
    url: 'https://www.youtube.com/watch?v=bJ7Ez04B-1k'
  },
  {
    url: 'https://www.youtube.com/watch?v=10IpwnESAm8'
  }
  //THINK OF EDGE CASES
];

//TEST ACCOUNTS - Video frames
const testVideoFrames = [
  {
    framejson: 'videoframe 1 for routine',
    frameNumber: 10
  },
  {
    framejson: 'videoframe 2 for routine',
    frameNumber: 100
  },
  {
    framejson: 'videoframe 1 for practiceVid',
    frameNumber: 89
  },
  {
    framejson: 'videoframe 2 for practiceVid',
    frameNumber: 1489
  }
];

//TEST ACCOUNTS - Calibration frame
const testCalibrations = [
  {
    framejson: `choreo calibration frame for routine video`
  },
  {framejson: 'dancer calibration frame for practice video'}
];

//CREATE TEST USERS
async function createTestUsers() {
  const seededUsers = await Promise.all(
    testUsers.map(user => User.create(user))
  );

  const seededTeams = await Promise.all(
    testTeams.map(team => Team.create(team))
  );

  const seededCalibrationFrame = await Promise.all(
    testCalibrations.map(calibration => CalibrationFrame.create(calibration))
  );

  const seededVideos = await Promise.all(
    testVideos.map(video => Video.create(video))
  );

  const seededVideoFrames = await Promise.all(
    testVideoFrames.map(videoFrame => {
      return VideoFrame.create(videoFrame);
    })
  );

  //Associations
  //Team belongsToMany User
  let [waltzinMatildas, twinkleToes, tipTopHipHop] = seededTeams;

  let [choreographer, dancer] = seededUsers;
  waltzinMatildas.setUsers(seededUsers);

  twinkleToes.setUsers(choreographer);
  tipTopHipHop.setUsers(dancer);

  //Team hasMany Video
  waltzinMatildas.setVideos(seededVideos);

  //Video belongsTo User
  let [routine, practiceVid] = seededVideos;
  routine.setUser(choreographer);
  practiceVid.setUser(choreographer);

  //Video hasMany VideoFrames
  let [
    routineFrame1,
    routineFrame2,
    practiceVidFrame1,
    practiceVidFrame2
  ] = seededVideoFrames;

  routine.setVideoframes(routineFrame1, routineFrame2);

  practiceVid.setVideoframes(practiceVidFrame1, practiceVidFrame2);

  //Video hasOne CalibrationFrame
  let [routineCalibration, practiceCalibration] = seededCalibrationFrame;

  routine.setCalibrationFrame = routineCalibration;

  practiceVid.setCalibrationFrame = practiceCalibration;
}

//CREATE FAKE USERS
async function createFakeUsers() {
  //Fake users & teams created at large
  for (let i = 0; i < totalSeeds; i++) {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: '12345',
      status: ['choreographer', 'dancer'][Math.round(Math.random())]
    };

    const team = {
      name: faker.lorem.word() + ' ' + faker.lorem.word()
    };

    const video = {
      url: faker.internet.url()
    };

    const videoFrame = {
      framejson: faker.lorem.sentence(),
      frameNumber: Math.round(Math.random() * 10000)
    };

    const calibration = {
      framejson: faker.lorem.sentence()
    };

    await Promise.all([
      User.create(user),
      Team.create(team),
      Video.create(video),
      VideoFrame.create(videoFrame),
      CalibrationFrame.create(calibration)
    ]);
  }
}

//SEED DB (TEST + FAKE USERS)
const seedDB = async () => {
  try {
    await db.sync({force: true});
    await createTestUsers();
    await createFakeUsers();
    let totalUsers = totalSeeds + testUsers.length;

    let totalTeams = totalSeeds + testTeams.length;

    let totalVideos = totalSeeds + testVideos.length;

    let totalVideoFrames = totalSeeds + testVideoFrames.length;

    let totalCalibrations = totalSeeds + testCalibrations.length;

    console.log(
      green(
        `...5, 6, 7, 8! Database seeded with ${totalUsers} users, ${totalTeams} teams, ${totalVideos} videos, ${totalVideoFrames} video frames and ${totalCalibrations} calibrations.`
      )
    );
  } catch (err) {
    console.error(red(err));
  }
};

module.exports = seedDB;

if (require.main === module) {
  seedDB()
    .then(() => {
      console.log(green('Time to get dancing!'));
      db.close();
    })
    .catch(err => {
      console.error(red(err));
      db.close();
    });
}
