import React from 'react';


export default function Banner(props) {
    /**
     * message=""
     * type= warning,error,success,caution
     *
     * **/
    let icon = "";
    let colour = "#000000";
    let textCol = "#ffffff";
    if (props.type === "warning") {
        icon = (
            <svg width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
        )
        colour = "#dc3545";
        textCol = "#ffffff";
    }

    const output = (
        <div className="banner" style={{color: textCol, backgroundColor: colour}}>
            {icon}
            {props.message}
        </div>
    );


    return output;
}