import React, {useState} from 'react';
import Banner from "../Components/Banner";
import Button from "../Components/Button";
import LoginButton from "../Components/LoginButton";
import {requestCode} from "../auth";
import {saveItem} from "../version";

export default function Register(props) {
    const [state, setState] = useState(setInitialState(props.currentState));
    const [linkingCode, setLinkingCode] = useState("");
    const [banner, setBanner] = useState("");

    function setInitialState(currentState) {
        if (currentState === "start") {
            return 0;
        }
        else if (currentState === "link_login_success") {
            return 200;
        }
        else if (currentState === "link_login_fail") {
            return 400;
        }
    }

    let loginButtons = "";
    if (state === 2) {
        loginButtons = (
            <div className="stack">
                <div className="card flat">
                    <h1>Choose a login service</h1>
                    <p>This login will be linked to your elos account.</p>
                </div>
                <LoginButton action={handleClick} serviceName={"SBHS"} authType={'register'} />
                <LoginButton action={handleClick} serviceName={"Discord"} authType={'register'} />
            </div>
        )
    }
    else if (state === 3) {
        loginButtons = (
            <div className="stack">
                <div className="card flat">
                    <h1>Choose a login service</h1>
                    <p>This login will be linked to your elos account.</p>
                </div>
            </div>
        )
    }

    function handleClick(service) {
        setState(3);
        saveItem('linkService', {timestamp: Date.now(), service: service, linkingCode: linkingCode});
        requestCode(service);
    }

    let page = "";
    if (state === 0) {
        page = (
            <div className="stack">
                <h1 className="login__title">Register</h1>
                <p>[Insert terms of service here]</p>
                <Button text={"agree"} type={"green"} action={agreeToTerms} />
            </div>
        )
    }
    else if (state === 1 || state === 2 || state === 3) {
        page = (
            <div className="stack">
                <h1 className="login__title">Register</h1>
                <div className="card">
                    <h4>Enter linking code:</h4>
                    <p>Code format is 9 characters and contains only alphabet characters and numbers.</p>
                    <input name="linkingCode" id="linkingCode" onChange={handleEnterLinkingCode}
                           type="text" maxLength={9}
                           className="linking-code-input input-text"
                           defaultValue={""}
                    />
                    {banner}
                    <p>
                        Note: This button can only check if the code is formatted correctly, it cannot check if the code
                        is valid. If a code is incorrect or expired there will be an error at the last step.
                    </p>
                </div>
                {loginButtons}
            </div>
        )
    }
    else if (state === 200) {
        page = (
            <div className="stack">
                <h1 className="login__title">Register</h1>
                <div className="card">
                    <h2>Success!</h2>
                    <Banner type={'green'} message={'Your login service was linked.'} />
                </div>
                <br />
                <br />
                <div className="login__button" onClick={() => props.login()}>
                    <h4>Proceed to login</h4>
                </div>
            </div>
        )
    }
    else if (state === 400) {
        page = (
            <div className="stack">
                <h1 className="login__title">Register</h1>
                <div className="card">
                    <h2>Error :( </h2>
                    <Banner type={'red'} message={'Your login service could not be linked.'} />
                </div>
                <br />
                <p>This could be because the linking code was expired, or incorrect.</p>
                <p>Or there could be a problem with our server right now.</p>
                <br />
                <br />
                <div className="login__button" onClick={() => props.login()}>
                    <h4>Try again.</h4>
                </div>
            </div>
        )
    }

    function agreeToTerms() {
        setState(1);
    }

    function handleEnterLinkingCode(e) {
        let input = checkFormat(e.target.value);
        e.target.value = input;
        setLinkingCode(input);
        // console.log(linkingCode);
    }

    function checkFormat(textbox) {
        const allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let rawInput = textbox.trim().toUpperCase();
        let code = "";
        let valid = true;
        for (const char of rawInput) {
            if (allowed.includes(char) === false) {
                valid = false;
            }
            else {
                code += char;
            }
        }
        if (code.length === 9 && valid) {
            setBanner(<Banner message={"Code format is correct."} type={'green'} />);
            setState(2);
        }
        else if (code.length < 9) {
            setBanner(<Banner message={"Code needs to have 9 characters"} type={'yellow'} />);
            setState(1);
        }
        return code;
    }

    return page;
}