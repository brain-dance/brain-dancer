import React, {useState} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
import {Image, Label, Menu} from 'semantic-ui-react';

export const TeamList = props => {
  const {teams, handleSelectTeam} = props;
  const [isActiveItem, setIsActiveItem] = useState('');

  const handleItemClick = (e, {name}) => {
    setIsActiveItem(name);
    const selected = teams.find(team => team.name === name);
    handleSelectTeam(selected);
  };

  return !teams.length ? (
    <div>
      <br />
      <Image
        size="mini"
        src="https://icon-library.net/images/dance-party-icon/dance-party-icon-15.jpg"
      />
      <p>No team? Join a team to get dancing!</p>
    </div>
  ) : (
    <Menu pointing vertical>
      {teams.map(team => {
        return (
          <Menu.Item
            key={team.id}
            name={team.name}
            active={isActiveItem === team}
            onClick={handleItemClick}
          >
            <Image
              size="mini"
              src="https://cnjballet.com/files/2019/05/ballerina_3502865_1280.png"
            />
            <Label color="teal" />
            {team.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default TeamList;
