import React, {useState, useEffect} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Image, Menu} from 'semantic-ui-react';

export const TeamList = props => {
  const {teams, handleSelectTeam} = props;
  const [isActiveItem, setIsActiveItem] = useState('');

  useEffect(() => {
    //if no team selected yet, but URL includes teamId
    if (props.match.params.teamId) {
      const selected = teams.filter(team => {
        if (team.id === +props.match.params.teamId) {
          return team;
        }
      });
      handleSelectTeam(selected[0]);
    } else {
      //if /dashboard + no teams selected yet, first team shows up by default
      let defaultSelected = teams[0];
      setIsActiveItem(defaultSelected);
      handleSelectTeam(defaultSelected);
    }
  }, []);

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
    <div id="team-names">
      {teams.map(team => {
        return (
          <Menu.Item
            key={team.id}
            name={team.name}
            active={isActiveItem === team}
            onClick={handleItemClick}
            as={Link}
            to={`/team/${team.id}`}
          >
            {/* <Image
              avatar
              src="https://cnjballet.com/files/2019/05/ballerina_3502865_1280.png"
            /> */}
            {team.name}
          </Menu.Item>
        );
      })}
    </div>
  );
};

export default withRouter(TeamList);
