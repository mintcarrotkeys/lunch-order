import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {passItem} from "./version";
import {fetchData, login} from "./auth";


function App() {

    const [order, setOrder] = useState(false);
    const [data, setData] = useState(false);
    const [selectOrder, setSelectOrder] = useState(false);

    const token = passItem('token');
    let userName = "";
    if (token !== null) {
        userName = token.name;
    }

    React.useEffect(() => {
        login().then(() => getDates()).then(res => setSelectOrder(res));
    }, []);



    function selectDate(e) {
        let dateName = e.target.value;
    }

    async function getDates() {
        let orderDates = await fetchData("dates");
        console.log(orderDates);
        if (orderDates !== false) {
            let options = [];
            let i = 0;
            while (i < orderDates.dates.length) {
                options.push(<option value={orderDates.dates[i]}>{orderDates.dates[i]}</option>)
                i++;
            }

            return (<div>
                Select Date:
                <select name="dates" id="dates" onChange={selectDate} defaultValue={null}
                        className="dropdown__selector">
                    {options}
                </select>
            </div>)
        }
        else {
            return (<p>Error - couldn't fetch data</p>);
        }
    }

    return (
        <div className="App">
            <div className="page">
                <div className="card title">
                    <h1>e Lunch Order System</h1>
                    <h2>Welcome: {userName}</h2>
                </div>
                <div className="card">
                    {selectOrder}
                </div>
            </div>
        </div>
    );
}

export default App;
