import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <PrivateRoute exact path="/" component={Dashboard} />
      <Route exact path="/login" component={Login} />
    </Router>
  )
}

export default App;
