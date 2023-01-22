import {passItem, saveItem} from "./version";

const siteURL = encodeURIComponent('https://shsrc.pages.dev');
const useAppId = "elos";
const serverURL = "https://elos.genericbells.workers.dev/";
const discordAppId = "1059400423817097216";
const googleAppId = encodeURIComponent("443830682269-vhgecpmtpqk43glhdcnubk5llj7eomab.apps.googleusercontent.com");
const timeAllowedForLinkService = 2*60*60*1000 - 5*1000;

export async function requestCode(service) {
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
    localStorage.setItem('handle_service', service);

    let requestURL = "";
    if (service === "SBHS") {
        requestURL = (
            "https://student.sbhs.net.au/api/authorize?" +
            "client_id=" + appId + "&" +
            "response_type=code&" +
            "state=" + state + "&" +
            "code_challenge=" + codeChallenge + "&" +
            "code_challenge_method=S256&" +
            "scope=all-ro&" +
            "redirect_uri=" + redirect
        );
    }
    else if (service === "Discord") {
        requestURL = (
            "https://discord.com/api/oauth2/authorize?" +
            "client_id=" + discordAppId + "&" +
            "response_type=code&" +
            "state=" + state + "&" +
            "code_challenge=" + codeChallenge + "&" +
            "code_challenge_method=S256&" +
            "scope=identify&" +
            "redirect_uri=" + redirect
        );
    }
    else if (service === "Google") {
        requestURL = (
            "https://accounts.google.com/o/oauth2/auth?" +
            "client_id=" + googleAppId + "&" +
            "response_type=code&" +
            "state=" + state + "&" +
            "code_challenge=" + codeChallenge + "&" +
            "code_challenge_method=S256&" +
            "scope=" + encodeURIComponent("https://www.googleapis.com/auth/userinfo.email") + "&" +
            "redirect_uri=" + redirect
        );
    }

    window.location.assign(requestURL);

}

export async function requestToken() {
    const params = new URLSearchParams(window.location.href.toString().split("?")[1]);
    const code = params.get('code');
    const returnedState = params.get('state');
    window.history.replaceState({}, "", "/");
    const codeVerifier = localStorage.getItem('handle_verifier');
    const state = localStorage.getItem('handle_state');
    const service = localStorage.getItem('handle_service');
    if (codeVerifier == null) {
        return false;
    }
    if (params.has('code') === false) {
        return false;
    }
    if (returnedState !== state) {
        return false;
    }

    let requestBody = {'service': service, 'code': code, 'verifier': codeVerifier}
    let requestHeaders = {"Content-type": "application/json; charset=UTF-8"};
    let requestType = "token";

    localStorage.removeItem('handle_state');
    localStorage.removeItem('handle_verifier');
    localStorage.removeItem('handle_service');

    //this bit deals with registering a new login service
    let linkService = passItem('linkService');
    let linkingLogin = linkService !== null;
    if (linkingLogin) {
        if (linkService.timestamp + timeAllowedForLinkService > Date.now()) {
            requestHeaders['Authorization'] = linkService.linkingCode;
            requestType = "linkService";
        }
        else {
            return "link_login_fail";
        }
    }

    let fetchToken = await fetch((serverURL + "?ask=" + requestType), {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(requestBody)}).catch(e => console.log(e));

    if (linkingLogin) {
        localStorage.removeItem('linkService');
        if (!fetchToken.ok) {
            return "link_login_fail";
        }
        else {
            return "link_login_success";
        }
    }
    else {
        if (!fetchToken.ok) {
            return false;
        }
        const elosToken = await fetchToken.json();

        if (elosToken['status'] === 'success') {
            saveItem('token', elosToken);
        }
        else {
            return false;
        }

        return true;
    }
}

export async function login() {
    const params = new URLSearchParams(window.location.href.toString().split("?")[1]);
    if (params.has('code')) {
        let response = false;
        await requestToken().then(res => response=res).catch(e => console.log(e));
        return response;
    }

    const token = passItem('token');
    if (token !== null) {
        if (token.validity > (Date.now() + 10*60*1000)) {
            return true;
        }
    }

    return "login_page";
}

export async function fetchData(ask, params=null) {

    let elosTokens = passItem('token');
    if (elosTokens === null) {
        return false;
    }
    else if (elosTokens.validity < (Date.now() + 60*1000)) {
        window.location.reload();
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