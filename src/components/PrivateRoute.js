import React from 'react'
import { Route, Redirect } from 'react-router-dom'
const PrivateRoute = ({ component: Component, ...rest }) => {

    return (
        <Route
            {...rest}
            render={props =>
                JSON.parse(localStorage.getItem('token')) ? (
                    <Component {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login"
                            }}
                        />
                    )
            }
        />
    );
}

export default PrivateRoute