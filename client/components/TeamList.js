import React, {useState, useEffect} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Image, Menu} from 'semantic-ui-react';

export const TeamList = props => {
  const {teams, handleSelectTeam, selectedTeam} = props;
  const [activeTeamId, setActiveTeamId] = useState(0);

  useEffect(() => {
    //if no team selected yet, but URL includes teamId

    //if /dashboard + no teams selected yet, first team shows up by default
    setActiveTeamId(selectedTeam.id);
    handleSelectTeam(selectedTeam);
  }, []);

  const handleItemClick = (e, {name}) => {
    setActiveTeamId(name);
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
            name={team.id}
            active={+activeTeamId === team.id}
            onClick={handleItemClick}
            as={Link}
            to={`/team/${team.id}`}
          >
            {team.name}
          </Menu.Item>
        );
      })}
    </div>
  );
};

export default withRouter(TeamList);
