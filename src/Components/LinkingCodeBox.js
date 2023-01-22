import React, {useState} from 'react';
import Banner from "./Banner";


export default function LinkingCodeBox(props) {

    const [copy, setCopy] = useState(<p>Click code to copy to clipboard.</p>);

    const linkingCode = props.linkingCode;

    function copyCode(e) {
        navigator.clipboard.writeText(linkingCode.code);
        setCopy(<p>Copied.</p>)
    }

    return (
        <div className="card stack">
            <h3>{linkingCode.user}</h3>
            <div className="linking-code-copy-box" onClick={copyCode}>
                <h1 className="linking-code-input">{linkingCode.code}</h1>
            </div>
            {copy}
        </div>
    )
}