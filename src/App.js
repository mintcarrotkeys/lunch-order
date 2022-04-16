import React, {useState} from 'react';
import {passItem} from "./version";
import {fetchData, login} from "./auth";
import Nav from "./Components/Nav";
import Order from "./Pages/Order";


function App() {

    const [page, setPage] = useState(null);
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

    let showPage = "";
    if (dataState === null) {
        showPage = (
            <div className="card"><h4>Loading ...</h4></div>
        );
    }
    else if (dataState === false) {
        showPage = (
            <div className="card"><p>Error - could not login, reload to try again.</p></div>
        );
    }
    else if (dataState === "redirect") {
        showPage = (
            <div className="card"><h4>Redirecting to login ...</h4></div>
        );
    }
    else if (page === null) {
        setPage('order');
    }

    if (page === "order") {
        showPage = <Order />;
    }

    return (
        <div className="container">
            <div className="card title">
                <h1>e Lunch Order System</h1>
                <h2><span style={{fontWeight: 300}}>Welcome:</span> {userName}</h2>
            </div>
            <Nav setPage={changePage} currentPage={page} userScope={(token!==null ? token.scope : null)} />
            {showPage}
        </div>
    );
}

export default App;
