import React from 'react';

export default function ThinButton(props) {
    /***
     * text=""
     * type=grey/blue/green/red/yellow
     * action=func()
     * visible
     *
     * **/

    function handleClick() {
        props.action();
    }

    let boxStyle = {};
    if (props.type === "grey") {
        boxStyle = {
            backgroundColor: "#555",
            borderColor: "#555",
            outlineColor: "#555",
            color: "white"
        }
    }
    else if (props.type === "green") {
        boxStyle = {
            backgroundColor: "#198754",
            borderColor: "#198754",
            outlineColor: "#198754",
            color: "white"
        }
    }
    else if (props.type === "red") {
        boxStyle = {
            backgroundColor: "#dc3545",
            borderColor: "#dc3545",
            outlineColor: "#dc3545",
            color: "white"
        }
    }
    else if (props.type === "yellow") {
        boxStyle = {
            backgroundColor: "#ffc107",
            borderColor: "#ffc107",
            outlineColor: "#ffc107",
            color: "black"
        }
    }
    else if (props.type === "blue") {
        boxStyle = {
            backgroundColor: "#12699f",
            borderColor: "#12699f",
            outlineColor: "#12699f",
            color: "white"
        }
    }

    let buttonStyle = {
        ...boxStyle,
        visibility: (props.visible ? 'visible' : 'hidden')
    }

    const output = (
        <div className="button-thin grid-item" onClick={handleClick} style={buttonStyle}>
            {props.text}
        </div>
    )
    return output;
}