import React, {useState} from 'react';
import {passItem} from "./version";
import {fetchData, login} from "./auth";
import Nav from "./Components/Nav";
import MyOrder from "./Pages/MyOrder";
import Users from "./Pages/Users";
import See from "./Pages/See";
import Dates from "./Pages/Dates";
import Login from "./Pages/Login";
import Register from "./Pages/Register";


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

    function setRedirect() {
        setDataState("redirect");
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
    else if (dataState === "login_page") {
        pageBox = (<Login action={setRedirect} />);
    }
    else if (dataState === "redirect") {
        pageBox = (
            <div className="main__page">
                <h1 className="login__title">Redirecting to login ...</h1>
            </div>
        );
    }
    else if (dataState === "link_login_fail" || dataState === "link_login_success") {
        pageBox = <Register currentState={dataState} login={() => {setDataState("login_page")}} />
    }
    else if (page === null) {
        setPage('order');
    }
    else if (dataState) {
        let showPage = "";
        if (page === "order") {
            showPage = (
                <MyOrder actionAfterOrder={(() => {window.location.reload()})} />
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
            <div className="stack main__page">
                <Nav setPage={changePage} allowed={allowedPages} currentPage={page} />
                {showPage}
            </div>
        )
    }

    return (
            <div className="container">
                <div className="card title">
                    <div className="logo__box">
                        <img src="favicon-elos.svg" alt="logo" className="logo__icon"/>
                        <h1 className="logo__text">elos</h1>
                    </div>
                    <h1 className="title__username">{userName}</h1>
                </div>
                {pageBox}
                <div className="stack">
                    <div className="card" style={{marginTop: '65px', boxShadow: 'none'}}>
                        <p>
                            <a href="https://github.com/mintcarrotkeys/lunch-order/blob/main/LICENSE"
                               style={{color: "black"}}>
                                License
                            </a>
                        </p>
                    </div>
                </div>
            </div>
    );
}

export default App;
