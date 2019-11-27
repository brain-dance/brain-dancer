import React, {useState, useEffect} from 'react';
// import ScrollMenu from 'react-horizontal-scrolling-menu';
import {Button, Card, Grid, Icon} from 'semantic-ui-react';
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
// function makeRed(ctx) {
//   ctx.fillStyle = 'red';
//   ctx.fillRect(0, 0, 300, 150);
//   ctx.clearRect(20, 20, 100, 50);
// }

const PrevAttempts = props => {
  let {recording, handleDelete} = props;
  let attempt = 0;

  const handleRewatch = (e, {name}) => {
    let video = document.getElementById(name);
    video.play();
  };

  return !recording.length ? (
    <h3>You have not recorded any videos yet!</h3>
  ) : (
    <Grid columns={2}>
      {recording.map(blob => {
        let blobSrc = URL.createObjectURL(blob);
        attempt++;
        return (
          <Grid.Column key={blob.name}>
            <Card>
              <Card.Content>
                <Card.Header>Recording {attempt}</Card.Header>
                <video id={blob.name} width="100" src={blobSrc} />
                <Icon name="play" />
              </Card.Content>
              <Card.Content extra>
                {/* <div className="ui two buttons"> */}
                <Button
                  basic
                  color="green"
                  type="button"
                  name={blob.name}
                  onClick={handleRewatch}
                >
                  Rewatch
                </Button>
                <Button
                  name={blob.name}
                  type="button"
                  onClick={handleDelete}
                  basic
                  color="red"
                >
                  Delete
                </Button>
                {/* </div> */}
              </Card.Content>
            </Card>
          </Grid.Column>
        );
      })}
    </Grid>
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
};

export default PrevAttempts;
