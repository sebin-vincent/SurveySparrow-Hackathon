import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import Game from './pages/Game/Game';
import Home from './pages/Home/Home';
import Room from './pages/Room/Room';
import Start from './pages/Start/Start';
import Ready from './pages/Ready/Ready';
import Kahoot from './pages/Kahoot/Kahoot';
import GameHost from './pages/GameHost/GameHost';
import Dashboard from './pages/Dashboard/Dashboard';
import ReadyHost from './pages/ReadyHost/ReadyHost';
import Collection from './pages/Collection/Collection';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import Instructions from './pages/Instructions/Instructions';
import KahootCreate from './pages/KahootCreate/KahootCreate';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import KahootDetailPage from './pages/KahootDetailPage/KahootDetailPage';

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/game" component={Game} />
                <Route exact path="/game-host" component={GameHost} />
                <Route path="/room/:id?" component={Room} />
                <Route exact path="/start" component={Start} />
                <Route exact path="/ready" component={Ready} />
                <Route exact path="/ready-host" component={ReadyHost} />
                <PrivateRoute exact path="/kahoots" component={Kahoot} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/collections" component={Collection} />
                <PrivateRoute exact path="/kahoot/create" component={KahootCreate} />
                <PrivateRoute exact path="/kahoot/:id" component={KahootDetailPage} />
                <PrivateRoute exact path="/kahoot/:id/edit" component={KahootCreate} />
                <Route exact path="/instructions" component={Instructions} />
                <Route exact path="/page-not-found" component={PageNotFound} />
                <Redirect to="/page-not-found" />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;