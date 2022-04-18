import React from 'react';


export default function Banner(props) {
    /**
     * message=""
     * type= red,yellow,green
     *
     * **/
    let icon = "";
    let colour = "#000000";
    let textCol = "#ffffff";
    if (props.type === "red") {
        icon = (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
        )
        colour = "#dc3545";
        textCol = "#ffffff";
    }
    else if (props.type === "green") {
        icon = (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
        )
        colour = "#198754";
        textCol = "#ffffff";
    }
    else if (props.type === "yellow") {
        icon = (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
        )
        colour = "##ffc107";
        textCol = "black";
    }

    const output = (
        <div className="banner" style={{color: textCol, backgroundColor: colour}}>
            {icon}
            <p className="banner__text">{props.message}</p>
        </div>
    );


    return output;
}