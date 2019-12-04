import React from 'react';

import {Navbar} from './components';
import Routes from './routes';

const App = () => {
  return (
    <React.Fragment>
      <Navbar id="nav" />
      <Routes />
    </React.Fragment>
  );
};

export default App;
