import React, {useState, useEffect} from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import {Segment} from 'semantic-ui-react';
// import VideoAttemptViewer from './VideoPlayer';

// const MenuItem = ({text, selected}) => {
//   return <div className={`menu-item ${selected ? 'active' : ''}`}>{text}</div>;
// };

// export const Menu = (list, selected) =>
//   list.map(blob => {
//     const {key} = blob;
//     return <MenuItem text={key} key={name} selected={selected} />;
//   });

// const Arrow = ({text, className}) => {
//   return <div className={className}>{text}</div>;
// };

// const ArrowLeft = Arrow({text: '<', className: 'arrow-prev'});
// const ArrowRight = Arrow({text: '>', className: 'arrow-next'});

//ACTUAL COMPONENT

const PrevAttempts = props => {
  const {vidSet, recordedData, handleRecord} = props; ///recording = array of Blob objects

  useEffect(() => {
    if (vidSet.hasKeys) {
      handleRecord(recordedData);
      console.log(vidSet);
    }
  });
  // if (recordedData) console.log('TCL: vidSet', vidSet);
  // const [evilVids, setEvilVids] = useState([]);
  // console.log('TCL: evilVid,', evilVids);

  // useEffect (() => {
  //   const setIter = vidSet[Symbol.iterator]();
  //   evilVids.push(setIter.next().value)
  //   console.log
  // }
  // const lastVid = vids[vids.length - 1]
  // if(!evilVids.includes(lastVid)
  // useEffect(() => {
  //   // if (vidR.length) {
  //   setEvilVid([...evilVid, vidR]);
  //   // }
  // }, [vidR.length]);
  // let allRecordings = [];
  // allRecordings.push(newVid);

  // const [selected, setSelected] = useState({});

  // let thumbnailCanvas = React.createRef();
  // console.log(
  //   'TCL: makeCanvas -> thumbnailCanvas.current',
  //   thumbnailCanvas.current
  // );

  // if (newVid.length) {
  //   const thumbnails = newVid.map(vid => {
  //     return <canvas key={vid.name} ref={thumbnailCanvas} />;
  //   });

  //   console.log('TCL: thumbnails', thumbnails);
  // }

  ////COME BACK TO THIS: SHOULD PASS IN CANVAS(ES) WITH IMAGE
  //{works when passing in recording ... }
  // const menuItems = Menu(thumbnails, selected);
  // console.log('TCL: menuItems', menuItems);

  // const onSelect = key => {
  //   setSelected(key);
  // };

  ////TRYING TO GET THUMBNAIL ON CANVAS + MOVE TO UTILS
  // let myWorker;
  // let messages = [];
  // // const videoWidth = '720px';
  // // const videoHeight = '480px';

  // // const makeCanvas = () => {
  // // const canvas = document.getElementById('output');
  // let thumbnailCanvas = React.createRef();
  // console.log(
  //   'TCL: makeCanvas -> thumbnailCanvas.current',
  //   thumbnailCanvas.current
  // );

  // // if (thumbnailCanvas.current) {
  // // const thumbnailCtx = thumbnailCanvas.current.getContext('2d');
  // // console.log('TCL: makeCanvas -> thumbnailCtx', thumbnailCtx);
  // // const ctx = canvas.getContext('2d');
  // // const sendThumbnail = (videoframe, timestamp) => {
  // //   wcContext.clearRect(0, 0, workerCanv.width, workerCanv.height);
  // //   wcContext.drawImage(video, 0, 0);
  // //   myWorker.postMessage({
  // //     image: wcContext.getImageData(
  // //       0,
  // //       0,
  // //       workerCanv.width,
  // //       workerCanv.height
  // //     ),
  // //     timestamp: timestamp
  // //   });
  // // };
  // // sendThumbnail();
  // console.log('Made it to if block');
  // };
  // };
  // const workerCanv = document.getElementById('skellies');
  // const wcContext = workerCanv.getContext('2d');

  // sendThumbnail();
  //////////////////////

  // makeCanvas();

  return !vidSet || !vidSet.length ? (
    <Segment>
      <h3>Record a video! It is fun!</h3>
    </Segment>
  ) : (
    <Segment>Hey. We ... tried to record</Segment>
    // <Segment id="gallery">
    //   {evilVids.map(vid => vid.name)}
    //   {/* <ScrollMenu
    //     data={menuItems}
    //     arrowLeft={ArrowLeft}
    //     arrowRight={ArrowRight}
    //     selected={selected}
    //     onSelect={onSelect}
    //     // useButtonRole
    //     // ref={thumbnailCanvas}
    //   /> */}
    // </Segment>
  );
};

export default PrevAttempts;
