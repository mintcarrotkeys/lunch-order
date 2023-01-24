import React, {useState} from 'react';

export default function ReloadButton(props) {

    const [state, setState] = useState(0);
    const colours = ["#ffffff", "#ffc107", "#198754"];
    const textColours = ["#000000", "#000000", "#ffffff"];
    async function handleClick(e) {
        if (state === 0) {
            setState(1);
            let res = await props.action();
            if (res) {
                setState(2);
                setTimeout(() => setState(0), 1500);
            }
        }

    }



    return (
        <div className="icon-box reload-button" onClick={(e) => handleClick(e)}
            style={{backgroundColor: colours[state], color: textColours[state]}}
        >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd"
                      d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path
                    d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
        </div>
    )

}