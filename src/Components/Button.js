import React from 'react';

export default function Button(props) {
    /***
     * text=""
     * type=grey/blue/green/red/yellow
     * action=func()
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
            backgroundColor: "#00a5cf",
            borderColor: "#00a5cf",
            outlineColor: "#00a5cf",
            color: "black"
        }
    }

    const output = (
        <div className="button" onClick={handleClick} style={boxStyle}>
            {props.text}
        </div>
    )
    return output;
}