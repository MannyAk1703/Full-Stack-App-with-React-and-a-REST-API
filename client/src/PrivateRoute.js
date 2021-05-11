import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Consumer>
            {context => (
                <Route
                    {...rest}
                    render={props => context.authenticatedUser ? (
                        <Component {...props} />
                    ) : (
                            <Redirect to={{
                                pathname: '/signin',
                                // current location of the route the user tried to access
                                state: { from: props.location },
                            }} />
                        )
                    }
                />
            )}
        </Consumer>
    );
};
export default PrivateRoute;

