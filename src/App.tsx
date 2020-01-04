import React from 'react';
import './App.css';
import 'antd/dist/antd.min.css';
import { Login } from './component/login-component/Login'
import { PetSearch } from './component/pet-search/pet-search';
import { Router , Route, Switch } from 'react-router-dom';
import history from './navigation/history';
import { PrivateRoute } from './component/guard/private-route';
import PageKey from './constants/page-key';
import AuthenticateGuard from './routerGuard/authenticate-guard';

const App: React.FC = () => {
  return (

    <Router history={history}>
      <Switch>
        <Route exact path={PageKey.HOME_PAGE} component={Login}/>
          <PrivateRoute authenticationPath={PageKey.HOME_PAGE} 
                        isAllowed={true} 
                        isAuthenticated={AuthenticateGuard.isAuthenticate} 
                        path={PageKey.PET_SEARCH} component={PetSearch}>
          </PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;
