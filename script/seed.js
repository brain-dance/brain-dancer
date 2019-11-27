const faker = require('faker');
const {
  User,
  UserTeam,
  Team,
  Routine,
  Practice,
  CalibrationFrame,
  VideoFrame
} = require('../server/db/models');
const db = require('../server/db/db');
const {green, red} = require('chalk');

const totalSeeds = 100;

//TEST ACCOUNTS - Users
const testUsers = [
  {
    name: 'Misty Copeland',
    email: 'misty.copeland@dance.com',
    password: '12345'
  },
  {
    name: 'Fred Astaire',
    email: 'fred.astaire@dance.com',
    password: '12345'
  }
  //THINK OF EDGE CASES
];

//TEST ACCOUNTS - Team
const testTeams = [
  {
    name: "Waltzin' Matildas",
    description:
      'Australian troupe committed to spreading the love of this ballad to the rest of the world.',
    category: 'Wango'
  },
  {
    name: 'Twinkle Toes',
    description:
      'Ballerinas with a passion for glitter and adapting Hollywood musicals for the ballet.',
    category: 'Ballet'
  },
  {
    name: 'TipTop HipHop',
    description: 'We are all about hip hop.',
    category: 'Hip hop'
  }
  //THINK OF EDGE CASES
];

//TEST ACCOUNTS - Video
const practiceVideo = {
  url:
    'https://res.cloudinary.com/braindance/video/upload/v1574452783/iedfpxyyuog4h0b1rjbj.mkv',
  title: 'how do i clap'
};

const routineVideo = {
  url:
    'https://res.cloudinary.com/braindance/video/upload/v1574452759/a4pj9pn4fcvujmcchtcr.mkv',
  title: 'chicken dance'
};

const routine2 = {
  url:
    'https://res.cloudinary.com/braindance/video/upload/v1574880013/rkim8udi1f7g6ln4o385.mkv',
  title: 'testy test'
};

//TEST ACCOUNTS - Video frames
// const testVideoFrames = [
//   {
//     framejson: 'JSON string of videoframe 1 for performance',
//     frameNumber: 10
//   },
//   {
//     framejson: 'JSON string of videoframe 2 for performance',
//     frameNumber: 100
//   },
//   {
//     framejson: 'JSON string of videoframe 1 for practice',
//     frameNumber: 89
//   },
//   {
//     framejson: 'JSON string of videoframe 2 for practice',
//     frameNumber: 1489
//   }
// ];

//TEST ACCOUNTS - Calibration frame
const testCalibrations = [
  {
    framejson: `choreo calibration frame for performance video`
  },
  {
    framejson: 'dancer calibration frame for practice video'
  }
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

  const seededPractice = await Practice.create(practiceVideo);

  const seededRoutine = await Routine.create(routineVideo);
  const anotherRoutine = await Routine.create(routine2);

  // routine belongs to team
  await seededRoutine.setTeam(1);
  await anotherRoutine.setTeam(1);
  // practice belongsto routine
  await seededPractice.setRoutine(1);

  // const seededVideoFrames = await Promise.all(
  //   testVideoFrames.map(videoFrame => {
  //     return VideoFrame.create(videoFrame);
  //   })
  // );

  //Associations
  //Team belongsToMany User
  let [waltzinMatildas, twinkleToes, tipTopHipHop] = seededTeams;

  let [choreographer, dancer] = seededUsers;

  //add users to
  await UserTeam.create({
    role: 'choreographer',
    userId: 1,
    teamId: 1
  });
  await UserTeam.create({
    role: 'dancer',
    userId: 1,
    teamId: 2
  });
  await UserTeam.create({
    role: 'choreographer',
    userId: 2,
    teamId: 2
  });
  await UserTeam.create({
    role: 'dancer',
    userId: 2,
    teamId: 3
  });

  //Video belongsTo User
  await seededRoutine.setUser(choreographer);
  await seededPractice.setUser(dancer);

  //Routine / Practice hasMany VideoFrames
  // let [
  //   performanceFrame1,
  //   performanceFrame2,
  //   practiceFrame1,
  //   practiceFrame2
  // ] = seededVideoFrames;

  // await seededRoutine.setVideoframes([performanceFrame1, performanceFrame2]);

  // await seededPractice.setVideoframes([practiceFrame1, practiceFrame2]);

  //Video hasOne CalibrationFrame
  let [routineCalibration, practiceCalibration] = seededCalibrationFrame;

  await routineCalibration.setRoutine(seededRoutine);

  await practiceCalibration.setPractice(seededPractice);
}

//CREATE FAKE USERS
async function createFakeUsers() {
  //Fake users & teams created at large
  for (let i = 0; i < totalSeeds; i++) {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: '12345'
    };

    const team = {
      name: faker.lorem.word() + ' ' + faker.lorem.word(),
      description: faker.lorem.sentence(),
      category: [
        'ballet',
        'hip hop',
        'waltz',
        'tango',
        'wango',
        'contemporary'
      ][Math.round(Math.random())]
    };

    const routine = {
      url: faker.internet.url(),
      title: faker.lorem.word()
    };

    const practice = {
      url: faker.internet.url(),
      title: faker.lorem.word()
    };

    // const videoFrame = {
    //   framejson: faker.lorem.sentence(),
    //   frameNumber: Math.round(Math.random() * 10000)
    // };

    const calibration = {
      framejson: faker.lorem.sentence()
    };

    await Promise.all([
      User.create(user),
      Team.create(team),
      Routine.create(routine),
      Practice.create(practice),
      // VideoFrame.create(videoFrame),
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

    let totalVideos = totalSeeds + 2;

    // let totalVideoFrames = totalSeeds + testVideoFrames.length;

    let totalCalibrations = totalSeeds + testCalibrations.length;

    console.log(
      green(
        `...5, 6, 7, 8! Database seeded with ${totalUsers} users, ${totalTeams} teams, ${totalVideos} videos, ${'totalVideoFrames'} video frames and ${totalCalibrations} calibrations.`
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
