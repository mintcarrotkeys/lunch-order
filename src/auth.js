import {passItem, saveItem} from "./version";

const siteURL = encodeURIComponent('https://shsrc.pages.dev');
const useAppId = "elos";
const serverURL = "https://elos.genericbells.workers.dev/";

export async function requestCode() {
    const redirect = siteURL;
    const appId = useAppId;
    //generate code verifier 43-128 characters long
    function randomString(length) {
        let randomNumbers = new Uint32Array(length);
        let verifier = "";
        const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
        crypto.getRandomValues(randomNumbers);
        for (const i of randomNumbers) {
            verifier += allowedChars.charAt((i % 66));
        }
        return verifier;
    }
    async function digestMessage(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        let hash;
        await crypto.subtle.digest('SHA-256', data).then(res => hash=res).catch(e => console.log(e));
        return hash;
    }
    function base64url(input) {
        let hashString = "";
        for (const i of input) {
            hashString += String.fromCharCode(i);
        }
        return btoa(hashString).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
    }
    const codeVerifier = randomString(128);
    const hash = await digestMessage(codeVerifier);
    const viewHash = new Uint8Array(hash);
    const codeChallenge = base64url(viewHash);
    const state = randomString(32);
    localStorage.setItem('handle_verifier', codeVerifier);
    localStorage.setItem('handle_state', state);

    const requestURL = (
        "https://student.sbhs.net.au/api/authorize?" +
        "client_id=" + appId + "&" +
        "response_type=code&" +
        "state=" + state + "&" +
        "code_challenge=" + codeChallenge + "&" +
        "code_challenge_method=S256&" +
        "scope=all-ro&" +
        "redirect_uri=" + redirect
    );

    window.location.assign(requestURL);

}

export async function requestToken() {
    const params = new URLSearchParams(window.location.href.toString().split("?")[1]);
    const code = params.get('code');
    const returnedState = params.get('state');
    window.history.replaceState({}, "", "/");
    const redirect = siteURL;
    const appId = useAppId;
    const codeVerifier = localStorage.getItem('handle_verifier');
    const state = localStorage.getItem('handle_state');
    if (codeVerifier == null) {
        return false;
    }
    if (params.has('code') === false) {
        return false;
    }
    if (returnedState !== state) {
        return false;
    }
    const requestBody = (
        "grant_type=authorization_code" +
        "&redirect_uri=" + redirect +
        "&client_id=" + appId +
        "&code=" + code +
        "&code_verifier=" + codeVerifier
    );
    const requestURL = (
        "https://student.sbhs.net.au/api/token"
    );

    let response = await fetch(requestURL, {
        method: "POST",
        headers: {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
        body: requestBody}).catch(e => console.log(e));
    if (!response.ok) {
        console.log("Error fetching tokens. -1");
        response = await fetch(requestURL, {
            method: "POST",
            headers: {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
            body: requestBody}).catch(e => console.log(e));
        if (!response.ok) {
            console.log('Error fetching tokens. -2');
            return false;
        }
    }
    let tokens = await response.json();
    // console.log(tokens);
    if (!tokens) {
        return false;
    }

    const elosGetToken = serverURL + "?ask=token";
    let elosRequest = {'token': tokens['access_token']}

    let elosResponse = await fetch(elosGetToken, {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(elosRequest)}).catch(e => console.log(e));
    if (!response.ok) {
        return false;
    }
    const elosToken = await elosResponse.json();

    if (elosToken['status'] === 'success') {
        saveItem('token', elosToken);
    }
    else {
        return false;
    }

    localStorage.removeItem('handle_state');
    localStorage.removeItem('handle_verifier');

    return true;
}


export async function login() {
    const params = new URLSearchParams(window.location.href.toString().split("?")[1]);
    if (params.has('code')) {
        let response = false;
        await requestToken().then(res => response=res).catch(e => console.log(e));
        return response === true;
    }



    const token = passItem('token');
    if (token !== null) {
        if (token.validity > (Date.now() + 10*60*1000)) {
            return true;
        }
    }

    requestCode();

    return "redirect";
}

export async function fetchData(ask, params=null) {

    let elosTokens = passItem('token');
    if (elosTokens === null) {
        return false;
    }
    else if (elosTokens.validity < (Date.now() + 60*1000)) {

        return "redirect";
    }

    let token = elosTokens.token;
    let requestUrl = serverURL + "?ask=" + ask;

    let res = false;
    await fetch(requestUrl, {method: "POST", body: JSON.stringify(params), headers: new Headers({'Authorization': token})}).then(r => res=r).catch(e => console.log(e));

    if (!res.ok) {
        await fetch(requestUrl, {method: "POST", body: JSON.stringify(params), headers: new Headers({'Authorization': token})}).then(r => res=r).catch(e => console.log(e));
        if (!res.ok) {
            return false;
        }
    }
    else {
        return res.json();
    }
}

export function randomString(length) {
    let randomNumbers = new Uint32Array(length);
    let output = "";
    const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    crypto.getRandomValues(randomNumbers);
    for (const i of randomNumbers) {
        output += allowedChars.charAt((i % 66));
    }
    return output;
}