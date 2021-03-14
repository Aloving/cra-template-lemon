import React from 'react';
import { Route, Switch } from 'react-router';

export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/">
        happy hacking!
      </Route>
    </Switch>
  );
};
