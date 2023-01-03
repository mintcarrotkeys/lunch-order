import React from 'react';

export default function LoginButton(props) {

    function handleClick() {
        props.action(props.serviceName);
    }

    return (
        <div className="login__button" onClick={handleClick}>
            <h4>Login with {props.serviceName}</h4>
        </div>
    )


}