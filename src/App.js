import React, {useState} from 'react';
import {passItem} from "./version";
import {fetchData, login} from "./auth";
import Nav from "./Components/Nav";
import Order from "./Pages/Order";
import Users from "./Pages/Users";
import See from "./Pages/See";
import Dates from "./Pages/Dates";


function App() {

    const [page, setPage] = useState("order");
    const [dataState, setDataState] = useState(null);

    const token = passItem('token');
    let userName = "";
    if (token !== null) {
        userName = token.name;
    }

    function changePage(selected) {
        setPage(selected);
    }

    React.useEffect(() => {
        login().then(res => setDataState(res));
    }, []);

    let allowedPages = [];
    if (token !== null) {
        let userScope = token.scope;
        if (userScope === 'user') {
            allowedPages = [{name: "Order Lunch", code: "order"}];
        }
        else if (userScope === "admin") {
            allowedPages = [
                {name: "Order Lunch", code: "order"},
                {name: "Manage Users", code: "users"},
                {name: "See Orders", code: "see"},
                {name: "Order Dates", code: "dates"}
            ];
        }
    }

    let pageBox = "";
    if (dataState === null) {
        pageBox = (
            <div className="card"><h4>Loading ...</h4></div>
        );
    }
    else if (dataState === false) {
        pageBox = (
            <div className="card"><p>Error - could not login, reload to try again.</p></div>
        );
    }
    else if (dataState === "redirect") {
        pageBox = (
            <div className="card"><h4>Redirecting to login ...</h4></div>
        );
    }
    else if (page === null) {
        setPage('order');
    }
    else if (dataState) {
        let showPage = "";
        if (page === "order") {
            showPage = (
                <Order admin={false} />
            );
        }
        else if (page === "users") {
            showPage = <Users />;
        }
        else if (page === "see") {
            showPage = <See />;
        }
        else if (page === "dates") {
            showPage = <Dates />
        }
        pageBox = (
            <div className="stack">
                <Nav setPage={changePage} allowed={allowedPages} currentPage={page} />
                {showPage}
            </div>
        )
    }

    return (
            <div className="container">
                <div className="card title">
                    <h1>e Lunch Order System</h1>
                    <h2><span style={{fontWeight: 300}}>Welcome:</span> {userName}</h2>
                </div>
                {pageBox}
                <div className="stack">
                    <div className="card" style={{marginTop: '65px'}}>
                        <p>Copyright (c) 2022 mintcarrotkeys <a href="https://github.com/mintcarrotkeys/lunch-order/blob/main/LICENSE">License</a></p>
                    </div>
                </div>
            </div>
    );
}

export default App;
