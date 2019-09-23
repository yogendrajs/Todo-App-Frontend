import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from  'react-router-dom';
import LoginPage from './LoginPage';
import App from './App';
import SignupPage from './SignupPage';
import ForgotPass from './ForgotPass';
import ResetPass from './ResetPass';
import Profile from './Profile';

export default class Main extends Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={ LoginPage } />
                <Route path="/login" exact component={ LoginPage }/>
                <Route path="/signup" exact component={ SignupPage } />
                <Route path="/profile" exact component={ Profile } />
                <Route path="/app" exact component={ App } />
                <Route path="/forgotpass" exact component={ ForgotPass } />
                <Route path="/resetpass" exact component={ ResetPass } />
            </Router>
        )
    }
}