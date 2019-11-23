import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button, Header, Icon, Label, List, Segment} from 'semantic-ui-react';
// import {getUser} from '../store/user';
import Dancer from './Dancer';
import Choreographer from './Choreographer';

/**
 * COMPONENT
 */
export const UserHome = props => {
  const user = useSelector(state => state.user);
  const isChoreographer = user.status === 'choreographer';

  ///THIS IS IN HERE JUST IN CASE USER NOT PULLED IN FROM STATE
  if (!user) {
    return <h3>Unexpected error! You do ... not exist!</h3>;
  } else {
    ///EVENTUALLY WANT TO FILTER BY CHOREOGRAPHING + DANCING
    return isChoreographer ? (
      <Choreographer user={user} />
    ) : (
      <Dancer user={user} />
    );
  }
};

export default UserHome;
