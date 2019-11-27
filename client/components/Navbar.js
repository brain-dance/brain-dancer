import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logout} from '../store';
import {Menu, Header, Icon, Image} from 'semantic-ui-react';

const Navbar = ({handleClick, isLoggedIn}) => (
  <div>
    {isLoggedIn ? (
      <Menu secondary>
        {/* The Menubar will show these links after you log in */}
        <Menu.Item name="home" as={Link} to="/home">
          <Image src="coreo.png" size="small" />
        </Menu.Item>
        <Menu.Item name="recordRoutine" as={Link} to="/new-routine">
          <Icon name="record" /> Routine
        </Menu.Item>
        <Menu.Item name="recordPractice" as={Link} to="/new-practice">
          <Icon name="record" /> Practice
        </Menu.Item>
        <Menu.Item position="right" name="logout" onClick={handleClick}>
          Logout
        </Menu.Item>
      </Menu>
    ) : (
      <Menu secondary>
        {/* The navbar will show these links before you log in */}
        <Menu.Item name="login" as={Link} to="/login">
          <Image src="coreo.png" size="small" />
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item name="login" as={Link} to="/login">
            Login
          </Menu.Item>
          <Menu.Item name="signup" as={Link} to="/signup">
            Sign Up
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )}
  </div>
);

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    }
  };
};

export default connect(mapState, mapDispatch)(Navbar);

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};
