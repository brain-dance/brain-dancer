import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Login,
  Signup,
  Dashboard,
  AddTeamForm,
  Choreo,
  RecordRoutine,
  RecordPractice
} from './components';
import {WatchRoutine} from './components/watchvideo';
import {me} from './store';
import WireframeTest from './components/WireframeTest';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const {isLoggedIn} = this.props;

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/addteam" component={AddTeamForm} />
        {/* <Route path="/routines/:id" component={Choreo} /> */}
        <Route path="/test" component={WireframeTest} />

        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route path="/watch/routines/:id" component={WatchRoutine} />
            <Route exact path="/home" component={Dashboard} />
            <Route
              path="/team/:teamId/routine/:routineId/add"
              component={RecordPractice}
            />
            <Route path="/team/:teamId/routine/:routineId" component={Choreo} />
            <Route path="/team/:teamId/add" component={RecordRoutine} />
            <Route path="/team/:teamId" component={Dashboard} />
            <Route exact path="/new-routine" component={RecordRoutine} />
            <Route exact path="/new-practice" component={RecordPractice} />
            <Route exact path="/assignments" component={Assignments} />
            <Route component={Dashboard} />
          </Switch>
        )}
        {/* Displays our Login component as a fallback */}
        <Route component={Login} />
      </Switch>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me());
    }
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};
