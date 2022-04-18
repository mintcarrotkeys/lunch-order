import React, {useState} from 'react';



export default function Nav(props) {

    /***
     * setPage=func()
     * allowed={name: ,code:}
     * currentPage
     * **/

    let showOptions = [];

    function handleClick(e) {
        props.setPage(e.target.id);
    }

    for (const i of props.allowed) {
        showOptions.push(
            <div className={"nav-item" + (i.code===props.currentPage ? " nav-current" : " nav-notCurrent")}
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
            {showOptions}
        </div>
    );
}