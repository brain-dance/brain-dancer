import React, {useState, useEffect} from 'react';
// import ScrollMenu from 'react-horizontal-scrolling-menu';
import {Card, Icon, Image} from 'semantic-ui-react';
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
  const {recording, recordedData} = props;

  const src =
    'data:image/png;base64,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';
  // useEffect(() => {
  //   if (vidSet.hasKeys) {
  //     handleRecord(recordedData);
  //     console.log(vidSet);
  //   }
  // });
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

  return !recording.length ? (
    <div>
      <h3>Record a video! It is fun!</h3>
    </div>
  ) : (
    <div>
      {recording.map(vid => {
        return <Card key={vid.name} color="teal" image={src} />;
      })}
    </div>
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
