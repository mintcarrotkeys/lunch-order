import React, {useState} from 'react';
import {fetchData} from "../auth";






export default function Order(props) {

    const [orderState, setOrderState] = useState(null);
    const [selectOrder, setSelectOrder] = useState((<div className="bar">Loading ...</div>));

    React.useEffect(() => {
        getDates().then(res => setSelectOrder(res)).catch((e) => console.log(e));
        }, []);

    function selectDate(e) {
        let orderName = e.target.value;
        if (orderName === "choose") {
            setOrderState(null);
        }
        else {
            getOrder(orderName).then(res => setOrderState(res));
        }
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

    async function getOrder(name) {
        setOrderState("loading");
        fetchData("getUserOrder", {orderName: name}).then(res => {
            if (res) {
                return res;
            }
        });
    }

    let orderDetails;
    if (orderState === null) {
        orderDetails = "";
    }
    else if (orderState === false) {
        orderDetails = (<div className="card">Error, couldn't fetch data, reload to try again.</div>);
    }
    else if (orderState === "loading") {
        orderDetails = (<div className="card">Loading ...</div>);
    }
    else if (orderState.hasOwnProperty("haveOrdered")) {
        if (orderState.haveOrdered) {
            orderDetails = (
                <div className="card">
                    <h2>Your Order</h2>
                    <p>You placed the order at: </p>
                    <p>{orderState.order.time}</p>
                    {/*{orderItems}*/}
                    {/*TODO: here*/}
                    <h2>Total Cost: </h2>
                </div>
            );
        }
    }


    return (
        <div className="page">
            <div className="card">
                {selectOrder}
                {orderDetails}
            </div>
        </div>
    );
}