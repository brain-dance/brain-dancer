import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logout} from '../store';
import {Button, Menu} from 'semantic-ui-react';

const Navbar = ({handleClick, isLoggedIn}, props) => (
  <div>
    <h1>BrainDancer</h1>
    <nav>
      {isLoggedIn ? (
        <Menu>
          {/* The Menubar will show these links after you log in */}
          <Menu.Item name="home" as={Link} to="/home">
            Home
          </Menu.Item>

          <Menu.Item name="logout" onClick={handleClick}>
            Logout
          </Menu.Item>
        </Menu>
      ) : (
        <Menu>
          {/* The navbar will show these links before you log in */}
          <Menu.Item name="login" as={Link} to="/login">
            Login
          </Menu.Item>
          <Menu.Item name="signup" as={Link} to="/signup">
            Sign Up
          </Menu.Item>
        </Menu>
      )}
    </nav>
    <hr />
  </div>
);

/**
 * CONTAINER
 */
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
