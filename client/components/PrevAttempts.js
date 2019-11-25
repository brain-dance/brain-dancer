import React, {useState} from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import {Segment} from 'semantic-ui-react';
// import '../../PrevAttempts.css';

//https://www.npmjs.com/package/react-horizontal-scrolling-menu

///recordedData (push to array)

// const attempts = [{name: 'video1'}];

const MenuItem = ({text, selected}) => {
  return <div className={`menu-item ${selected ? 'active' : ''}`}>{text}</div>;
};

export const Menu = (list, selected) =>
  list.map(vid => {
    // console.log(attempts);
    const {name} = vid;
    return <MenuItem text={name} key={name} selected={selected} />;
  });

const Arrow = ({text, className}) => {
  return <div className={className}>{text}</div>;
};

const ArrowLeft = Arrow({text: '<', className: 'arrow-prev'});
const ArrowRight = Arrow({text: '>', className: 'arrow-next'});

const PrevAttempts = props => {
  const {recording} = props; ///recording = array of Blob objects
  const [selected, setSelected] = useState({});
  const menuItems = Menu(recording, selected);

  const onSelect = key => {
    setSelected(key);
  };

  return !recording.length ? (
    <Segment>Record a video! It's fun!</Segment>
  ) : (
    <div className="App">
      <ScrollMenu
        data={menuItems}
        arrowLeft={ArrowLeft}
        arrowRight={ArrowRight}
        selected={selected}
        onSelect={onSelect}
      />
    </div>
  );
};

export default PrevAttempts;
