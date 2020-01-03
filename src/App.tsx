import React from 'react';
import './App.css';
import 'antd/dist/antd.min.css';
import { Login } from './component/login-component/Login'
import { PetSearch } from './component/pet-search/pet-search';
import { Router , Route, Switch } from 'react-router-dom';
import history from './navigation/history';

const App: React.FC = () => {
  return (

    <Router history={history}>
      <Switch>
        <Route exact path="/" >
          <Login />  
        </Route>
        <Route path="/pets" >
          <PetSearch />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
