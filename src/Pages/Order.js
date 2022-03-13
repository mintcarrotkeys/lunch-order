import React, {useState} from 'react';
import {fetchData} from "../auth";






export default function Order(props) {

    const [order, setOrder] = useState(false);
    const [data, setData] = useState(false);
    const [selectOrder, setSelectOrder] = useState((<div className="bar">Loading ...</div>));


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

            return (<div className="bar">
                <div className="dropdown_label">Select Date:</div>
                <select name="dates" id="dates" onChange={selectDate} defaultValue={"choose"}
                        className="dropdown__selector">
                    <option value={"choose"}>choose</option>
                    {options}
                </select>
            </div>)
        }
        else {
            return (<p>Error - couldn't fetch data</p>);
        }
    }


    return (
        <div className="page">
            <div className="card">
                {selectOrder}
            </div>
        </div>
    );
}