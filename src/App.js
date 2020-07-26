import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Products from './pages/Products';
import Sellers from './pages/Sellers';

const App = () => {
  return (
    <Router basename='/admin'>
      <Switch>
        <PrivateRoute exact path="/" component={Dashboard} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/products" component={Products} />
        <PrivateRoute exact path="/sellers" component={Sellers} />
        <Route path="**" render={() => <Redirect to={{ pathname: "/" }} />} />
      </Switch>
    </Router>
  )
}

export default App;
