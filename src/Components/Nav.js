import React, {useState} from 'react';



export default function Nav(props) {

    let showOptions = [];
    let allowed;

    function handleClick(e) {
        props.setPage(e.target.id);
    }

    if (props.userScope === 'user') {
        allowed = [{name:"Order Lunch", code:"order"}];
    }
    else if (props.userScope === "admin") {
        allowed = [];
    }
    else {
        allowed = [];
    }

    for (const i of allowed) {
        showOptions.push(
            <div className={"nav-button" + (i.code===props.currentPage ? " currentPage" : "")}
                 id={i.code}
                 key={i.code}
                 onClick={handleClick}
            >
                {i.name}
            </div>
        );
    }



    return (
        <div className="nav">
            <div className="nav-item">Order Lunch</div>



        </div>
    );
}