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
            backgroundColor: "#00a5cf",
            color: "black"
        }
    }
    else if (type === 'red') {
        css = {
            backgroundColor: "#dc3545",
            color: "white"
        }
    }

    css.margin = "2px 5px 4px 5px";

    const output = (
        <div className="badge-box" style={css}>
            <h6>{props.text}</h6>
        </div>



    );

    return output;
}