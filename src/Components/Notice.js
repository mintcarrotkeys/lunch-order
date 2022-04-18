import React from 'react';
import Button from "./Button";

export default function Notice(props) {
    /**
     * title
     * text
     * close
     * id
     * type
     *
     * button1  {
     *      text=""
     *      type=grey/blue/green/red/yellow
     *      action=func()
     *      id=
     * button2
     * **/
    let col = "white";
    let closeButton = {};
    if (props.type === "green") {
        col = "#198754";
        closeButton.borderColor = "#fff";
        closeButton.color = "#fff";
        closeButton.outlineColor = "#fff";
    }
    else if (props.type === "grey") {
        col = "#eeeeee";
        closeButton.borderColor = "#222";
        closeButton.color = "#222";
        closeButton.outlineColor = "#222";
    }
    else if (props.type === "red") {
        col = "#dc3545";
        closeButton.borderColor = "#fff";
        closeButton.color = "#fff";
        closeButton.outlineColor = "#fff";
    }
    else if (props.type === "blue") {
        col = "#12699f";
        closeButton.borderColor = "#fff";
        closeButton.color = "#fff";
        closeButton.outlineColor = "#fff";
    }
    else if (props.type === "yellow") {
        col = "#ffc107";
        closeButton.borderColor = "#222";
        closeButton.color = "#222";
        closeButton.outlineColor = "#222";
    }

    function handleClose() {
        props.close(props.id);
    }

    let button1 = "";
    if (props.button1 !== null) {
        button1 = (<Button text={props.button1.text} type={props.button1.type} action={props.button1Action} />);
    }

    let closeCross = "";
    if (props.noOffButton !== true) {
        closeCross = (<div className="notice-close" style={closeButton} onClick={handleClose} >
            <svg width="20px" height="20px" fill="currentColor" viewBox="0 0 16 16" >
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
        </div>);
    }


    const output = (
        <div className="notice-outer">
        <div className="notice-inner">
            <div className="notice-panel">
                <div className="notice-top" style={{backgroundColor: col}}>
                    {closeCross}
                </div>
                {props.text}
                {button1}
            </div>
        </div>
        </div>
    );


    return output;
}