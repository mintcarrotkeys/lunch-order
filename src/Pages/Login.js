import React from 'react';
import LoginButton from "../Components/LoginButton";
import {requestCode} from "../auth";


export default function Login(props) {

    function handleClick(serviceName) {
        props.action();
        requestCode(serviceName);
    }

    const page = (
        <div className="stack login__page">
            <h1 className="login__title">Login</h1>
            <LoginButton action={handleClick} serviceName={"SBHS"} />
        </div>
    );




    return page;
}