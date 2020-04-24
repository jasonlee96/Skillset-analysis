import React from 'react';
import { MainPage, Dashboard } from './components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/Skillset-Analysis" exact component={MainPage} />
        <Route path="/Skillset-Analysis/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
