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
function makeRed(ctx) {
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 300, 150);
  ctx.clearRect(20, 20, 100, 50);
}

class PrevAttempts extends React.Component {
  constructor(props) {
    super(props);
    this.canvasNode = document.querySelector('#thumbnailCanvas');
    this.src =
      'https://media.licdn.com/dms/image/C5603AQEAC4lcid_Y5w/profile-displayphoto-shrink_200_200/0?e=1580342400&v=beta&t=CGjCXdSgtyZ9qBAcjgO1ctU-06-b6fXm9jw5eF4TpAE';
  }
  // const {recording, recordedData} = props;

  componentDidMount() {
    const image = document.getElementById('source');
    let ctx = this.canvasNode.getContext('2d').drawImage(image, 100, 100);
    // drawImage(video, 0, 0);
    console.log('TCL: PrevAttempts -> componentDidMount -> ctx', ctx);
  }

  // const [selected, setSelected] = useState({});

  ////COME BACK TO THIS: SHOULD PASS IN CANVAS(ES) WITH IMAGE
  //{works when passing in recording ... }
  // const menuItems = Menu(thumbnails, selected);
  // console.log('TCL: menuItems', menuItems);

  // const onSelect = key => {
  //   setSelected(key);
  // };

  // makeCanvas();
  render() {
    const {recording} = this.props;

    // return !recording.length ? (
    //   <div>
    //     <h3>Record a video! It is fun!</h3>
    //   </div>
    // ) : (
    return (
      <div>
        <img id="source" src={this.src} />
        <canvas
          id="thumbnailCanvas"
          width="100"
          height="100"
          ref={node => (this.canvasNode = node)}
        ></canvas>
      </div>
    );
    // // <Segment id="gallery">
    // //   {evilVids.map(vid => vid.name)}
    // //   {/* <ScrollMenu
    // //     data={menuItems}
    // //     arrowLeft={ArrowLeft}
    // //     arrowRight={ArrowRight}
    // //     selected={selected}
    // //     onSelect={onSelect}
    // //     // useButtonRole
    // //     // ref={thumbnailCanvas}
    // //   /> */}
    // // </Segment>
    /* <Card key={vid.name} color="teal" image={src} /> */
    /* // </canvas> */
    /* // <canvas */
    /* //   zindex="-1"
          //   key={vid.name}
          //   id="canvas"
          //   ref={node => (canvas = node)}
          // > */
  }
}

export default PrevAttempts;
