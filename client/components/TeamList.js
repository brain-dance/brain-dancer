import React, {useState, useEffect} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Image, Menu} from 'semantic-ui-react';

export const TeamList = props => {
  const {teams, setSelectedTeamId, selectedTeamId} = props;

  const handleItemClick = teamId => {
    setSelectedTeamId(teamId);
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
            active={+selectedTeamId === team.id}
            onClick={() => handleItemClick(team.id)}
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

export default TeamList;
