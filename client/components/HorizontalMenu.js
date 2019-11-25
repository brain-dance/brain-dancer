import React from 'react';
// import ScrollMenu from 'react-horizontal-scrolling-menu';

// import {Header, Segment, Grid} from 'semantic-ui-react';

// const HorizontalMenu = props => {
// const {recorded} = props;
export const MenuItem = ({text, active}) => {
  return (
    <div className={`menu-item ${active ? 'active' : ''}`}>
      Attempt Number 1
    </div>
  );
};

export const Menu = (recorded, selected) =>
  recorded.map(item => {
    const {name} = item;
    return <MenuItem text={name} key={name} selected={selected} />;
  });

export const Arrow = ({text, className}) => {
  return <div className={className}>{text}</div>;
};

export const ArrowLeft = Arrow({text: '<', className: 'arrow-prev'});
export const ArrowRight = Arrow({text: '>', className: 'arrow-next'});

//   let selected = recorded[0];
// };

// export default HorizontalMenu;
