import React from 'react';



export default function Badge(props) {

    let css = {};
    const type = props.type;
    if (type === "grey") {
        css = {
            backgroundColor: "#555",
            color: "white"
        }
    }
    else if (type === 'yellow') {
        css = {
            backgroundColor: "#ffc107",
            color: "black"
        }
    }
    else if (type === 'green') {
        css = {
            backgroundColor: "#198754",
            color: "white"
        }
    }
    else if (type === 'blue') {
        css = {
            backgroundColor: "#12699f",
            color: "white"
        }
    }
    else if (type === 'red') {
        css = {
            backgroundColor: "#dc3545",
            color: "white"
        }
    }
    else if (type === 'purple') {
        css = {
            backgroundColor: "#592C85",
            color: "white"
        }
    }

    css.padding = "2px 6px 3px 6px";

    const output = (
        <div className="badge-box" style={css}>
            <p style={{margin: 0}}>{props.text}</p>
        </div>



    );

    return output;
}