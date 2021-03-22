import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Store from '../../../redux/ConfigureStore';
import { getAccessToken } from '../../../config/Utils';
import { addNextUrl } from '../../../redux/actions/App.actions';

const getRedirectionComponent = (props, Component) => {
    let routeElement;
    const authToken = getAccessToken();

    if (authToken) {
        routeElement = <Component {...props} />;
    }
    else {
        Store.dispatch(addNextUrl(props.location.pathname));
        routeElement = <Redirect to='/' />;
    }

    return routeElement;
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        getRedirectionComponent(props, Component)
    )} />
);

export default PrivateRoute;