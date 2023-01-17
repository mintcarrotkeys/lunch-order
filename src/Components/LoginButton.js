import React from 'react';

export default function LoginButton(props) {

    function handleClick() {
        props.action(props.serviceName);
    }

    if (props.authType === "login") {
        return (
            <div className="login__button" onClick={handleClick}>
                <h4>Login with {props.serviceName}</h4>
            </div>
        )
    }
    else if (props.authType === "register") {
        return (
            <div className="login__button" onClick={handleClick}>
                <h4>Register with {props.serviceName} account</h4>
            </div>
        )
    }


}