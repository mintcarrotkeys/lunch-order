import React, {useState} from 'react';
import LoginButton from "../Components/LoginButton";
import {requestCode} from "../auth";
import Register from "./Register";


export default function Login(props) {
    const [register, setRegister] = useState(false);

    function handleClick(serviceName) {
        props.action();
        requestCode(serviceName);
    }

    let page = "";
    if (register) {
        page = (
            <div className="stack main__page">
                <Register currentState={"start"} />
            </div>
        )
    }
    else {
        page = (
            <div className="stack main__page">
                <h1 className="login__title">Login</h1>
                <LoginButton action={handleClick} serviceName={"SBHS"} authType={'login'} />
                <LoginButton action={handleClick} serviceName={"Discord"} authType={'login'} />
                <LoginButton action={handleClick} serviceName={"Google"} authType={'login'} />
                <div className="login__button register__button" onClick={() => setRegister(true)}>
                    <h4>Register new login</h4>
                </div>
            </div>
        );
    }




    return page;
}