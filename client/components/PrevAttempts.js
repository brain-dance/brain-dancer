import React, {Component} from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import {Menu, ArrowLeft, ArrowRight} from './HorizontalMenu';

// import {Header, Segment, Grid} from 'semantic-ui-react';

// const MenuItem = ({text, selected}) => {
//   return <div className={`menu-item ${selected ? 'active' : ''}`}>{text}</div>;
// };

// export const Menu = (list, selected) =>
//   list.map(el => {
//     const {name} = el;

//     return <MenuItem text={name} key={name} selected={selected} />;
//   });

// const Arrow = ({text, className}) => {
//   return <div className={className}>{text}</div>;
// };

// const ArrowLeft = Arrow({text: '<', className: 'arrow-prev'});
// const ArrowRight = Arrow({text: '>', className: 'arrow-next'});

// const MySelected = 'video1';

// const PrevAttempts = () => {
const recorded = [
  {name: 'video1'},
  {name: 'video2'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video1'},
  {name: 'video2'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video1'},
  {name: 'video2'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'},
  {name: 'video3'}
];

const selected = 'video 1';

// return (
const PrevAttempts = () => {
  // constructor(props) {
  //   super(props);
  // call it again if items count changes
  const menuItems = Menu(recorded, MySelected);

  const state = {
    selected
  };

  // const onSelect = key => {
  //   setState({selected: key});
  // };

  // render() {
  const {selected} = state;
  // Create menu from items
  const menu = menuItems;

  return (
    <div className="App">
      <ScrollMenu
        data={menu}
        arrowLeft={ArrowLeft}
        arrowRight={ArrowRight}
        selected={selected}
        // onSelect={onSelect}
      />
    </div>
  );
};

export default PrevAttempts;
