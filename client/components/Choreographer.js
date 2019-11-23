import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button, Header, Icon, Label, List, Segment} from 'semantic-ui-react';
// import {getUser} from '../store/user';

/**
 * COMPONENT
 */
export const Choreographer = props => {
  const {user} = props;
  const {teams} = user;

  ///EVENTUALLY WANT TO FILTER BY CHOREOGRAPHING + DANCING

  return !teams.length ? (
    <Segment placeholder>
      <Header icon>
        <Icon color="grey" name="users" />
        You do not have any teams yet. Create one to get choreographing!
      </Header>
      {/* CLICKING THIS SENDS YOU TO CREATE TEAM FORM */}
      <Button color="olive">Create Team</Button>
    </Segment>
  ) : (
    <div>
      <Header as="h2">Welcome, {user.name}!</Header>
      <Header as="h3" icon>
        <Icon name="music" />
        My Teams
      </Header>
      <List>
        {teams.map(team => {
          return (
            <List.Item key={team.id}>
              <List.Icon name="users" />
              <List.Content>
                <List.Header as="a">{team.name}</List.Header>
                <List.Description>{team.description}</List.Description>
                {/* COULD EVENTUALLY CATEGORIZE COLOR BY CATEGORIES; NEED ENUM IN TEAM CATEGORY */}
                <Label color="pink" ribbon>
                  {team.category}
                </Label>
              </List.Content>
              <br />
            </List.Item>
          );
        })}
      </List>
    </div>
  );
};

export default Choreographer;
