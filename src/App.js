import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Products from './pages/Products';
import Sellers from './pages/Sellers';
import Orders from './pages/Orders';
import CreateOrder from './pages/CreateOrder';

const App = () => {
  return (
    <Router basename='/admin'>
      <Switch>
        <PrivateRoute exact path="/" component={Dashboard} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/products" component={Products} />
        <PrivateRoute exact path="/sellers" component={Sellers} />
        <PrivateRoute exact path="/orders" component={Orders} />
        <PrivateRoute exact path="/create-order" component={CreateOrder} />
        <Route path="**" render={() => <Redirect to={{ pathname: "/" }} />} />
      </Switch>
    </Router>
  )
}

export default App;
