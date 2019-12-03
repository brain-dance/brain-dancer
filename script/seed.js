const faker = require('faker');
const {generateWireframes} = require('../utils/videoProcessing');
const {
  User,
  UserTeam,
  Team,
  Routine,
  Practice,
  CalibrationFrame,
  VideoFrame,
  Assignment
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
    'https://res.cloudinary.com/braindance/video/upload/v1574452783/iedfpxyyuog4h0b1rjbj.mp4',
  title: 'how do i clap'
};

const chickenDance = {
  url:
    'https://res.cloudinary.com/braindance/video/upload/v1574452759/a4pj9pn4fcvujmcchtcr.mp4',
  title: 'chicken dance'
};

const testVideo = {
  url:
    'https://res.cloudinary.com/braindance/video/upload/v1574880013/rkim8udi1f7g6ln4o385.mp4',
  title: 'testy test'
};

const gorillaDansu = {
  url:
    'http://res.cloudinary.com/braindance/video/upload/v1574881624/db7tcuvwdxvjly2m4rme.mp4',
  title: 'Gorilla Dansu'
};

const idkDance = {
  url:
    'http://res.cloudinary.com/braindance/video/upload/v1574881747/dduo3i3txavwqwx4y8ad.mp4',
  title: 'IDK'
};

const finnDance = {
  url:
    'https://res.cloudinary.com/braindance/video/upload/v1574713680/yu1eqjego1oi8vajvlmr.mp4',
  title: 'The Finn Dance'
};

//TEST ACCOUNTS - Video frames
// const testVideoFrames = [
//   {
//     pose: 'JSON string of videoframe 1 for performance',
//     frameNumber: 10
//   },
//   {
//     pose: 'JSON string of videoframe 2 for performance',
//     frameNumber: 100
//   },
//   {
//     pose: 'JSON string of videoframe 1 for practice',
//     frameNumber: 89
//   },
//   {
//     pose: 'JSON string of videoframe 2 for practice',
//     frameNumber: 1489
//   }
// ];

//TEST ACCOUNTS - Calibration frame
const testCalibrations = [
  {
    pose: `choreo calibration frame for performance video`
  },
  {
    pose: 'dancer calibration frame for practice video'
  }
];

const testAssignments = [{completed: true}, {completed: false}];

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

  const seededAssignments = await Promise.all(
    testAssignments.map(assignment => Assignment.create(assignment))
  );

  const chickenRoutine = await Routine.create(chickenDance);
  const testRoutine = await Routine.create(testVideo);
  const gorillaRoutine = await Routine.create(gorillaDansu);
  const idkRoutine = await Routine.create(idkDance);
  const finn = await Routine.create(finnDance);

  // generate lots of wireframes - comment out if this takes too long :)
  const generatedSkellies = await generateWireframes(chickenRoutine.url);
  await Promise.all(
    generatedSkellies.map((skelly, i) => {
      return VideoFrame.create({
        pose: skelly,
        routineId: chickenRoutine.id,
        frameNumber: i
      });
    })
  );
  const gorillaSkellies = await generateWireframes(gorillaRoutine.url);
  await Promise.all(
    gorillaSkellies.map((skelly, i) => {
      return VideoFrame.create({
        pose: skelly,
        routineId: gorillaRoutine.id,
        frameNumber: i
      });
    })
  );
  const idkSkellies = await generateWireframes(idkRoutine.url);
  await Promise.all(
    idkSkellies.map((skelly, i) => {
      return VideoFrame.create({
        pose: skelly,
        routineId: idkRoutine.id,
        frameNumber: i
      });
    })
  );
  const finnSkellies = await generateWireframes(finn.url);
  await Promise.all(
    finnSkellies.map((skelly, i) => {
      return VideoFrame.create({
        pose: skelly,
        routineId: finn.id,
        frameNumber: i
      });
    })
  );

  // routine belongs to team
  await chickenRoutine.setTeam(1);
  await testRoutine.setTeam(1);
  await gorillaRoutine.setTeam(2);
  await idkRoutine.setTeam(2);
  await finn.setTeam(1);
  // practice belongsto routine
  await seededPractice.setRoutine(1);

  //

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

  let [finishedAssignment, pendingAssignment] = seededAssignments;

  //Video belongsTo User
  await chickenRoutine.setUser(choreographer);
  await seededPractice.setUser(dancer);

  //Assignment belongsTo User + belongsTo Routine; assign 2 routines to Fred Astaire, one of which is completed
  await finishedAssignment.setRoutine(1);
  await finishedAssignment.setUser(2);
  await pendingAssignment.setRoutine(2);
  await pendingAssignment.setUser(2);

  //Routine / Practice hasMany VideoFrames
  // let [
  //   performanceFrame1,
  //   performanceFrame2,
  //   practiceFrame1,
  //   practiceFrame2
  // ] = seededVideoFrames;

  // await chickenRoutine.setVideoframes([performanceFrame1, performanceFrame2]);

  // await seededPractice.setVideoframes([practiceFrame1, practiceFrame2]);

  //Video hasOne CalibrationFrame
  let [routineCalibration, practiceCalibration] = seededCalibrationFrame;

  await routineCalibration.setRoutine(chickenRoutine);

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
    //   pose: faker.lorem.sentence(),
    //   frameNumber: Math.round(Math.random() * 10000)
    // };

    const calibration = {
      pose: faker.lorem.sentence()
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
