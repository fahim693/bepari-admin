import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Products from './pages/Products';

const App = () => {
  return (
    <Router basename='/admin'>
      <PrivateRoute exact path="/" component={Dashboard} />
      <Route exact path="/login" component={Login} />
      <PrivateRoute exact path="/products" component={Products} />
    </Router>
  )
}

export default App;
