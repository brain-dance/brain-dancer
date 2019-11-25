import React, {useState} from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';

//https://www.npmjs.com/package/react-horizontal-scrolling-menu

const recordAttempts = [
  {name: 'video1'},
  {name: 'video2'},
  {name: 'video3'},
  {name: 'video4'},
  {name: 'video5'},
  {name: 'video6'},
  {name: 'video7'},
  {name: 'video8'},
  {name: 'video9'},
  {name: 'video11'},
  {name: 'video12'},
  {name: 'video13'},
  {name: 'video14'},
  {name: 'video15'},
  {name: 'video16'},
  {name: 'video17'},
  {name: 'video18'},
  {name: 'video19'},
  {name: 'video121'},
  {name: 'video131'},
  {name: 'video141'},
  {name: 'video151'},
  {name: 'video161'},
  {name: 'video171'},
  {name: 'video181'},
  {name: 'video191'}
];

///recordedData (push to array)

const MenuItem = ({text, selected}) => {
  return <div className={`menu-item ${selected ? 'active' : ''}`}>{text}</div>;
};

export const Menu = (list, selected) =>
  list.map(vid => {
    const {name} = vid;
    return <MenuItem text={name} key={name} selected={selected} />;
  });

const Arrow = ({text, className}) => {
  return <div className={className}>{text}</div>;
};

const ArrowLeft = Arrow({text: '<', className: 'arrow-prev'});
const ArrowRight = Arrow({text: '>', className: 'arrow-next'});

//UPDATED THIS SELECTED VARIABLE
// const selected = recordAttempts[0];

const PrevAttempts = () => {
  const menuItems = Menu(recordAttempts, selected);
  const [selected, setSelected] = useState({});

  const onSelect = key => {
    setSelected(key);
  };

  return (
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
