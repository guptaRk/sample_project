import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Profile from './components/Profile/profile';
import SignIn from './components/signIn/signin';
import withAuth from './withauth';
import Home from './components/Home/home';
const Routes = () => {

    return (
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" exact component={withAuth(Profile)} />
            <Route path="/sign-in" exact component={SignIn} />
        </Switch>
    )

}

export default Routes;