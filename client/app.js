import React from 'react';

import {Navbar} from './components';
import Routes from './routes';

const App = () => {
  return (
    <div>
      <Navbar id="nav" />
      <Routes />
    </div>
  );
};

export default App;
