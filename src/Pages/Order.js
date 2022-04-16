import React, {useState} from 'react';
import {fetchData} from "../auth";
import Selection from "../Components/Selection";






export default function Order(props) {

    const [orderState, setOrderState] = useState(null);
    const [selectOrder, setSelectOrder] = useState(null);
    const [orderId, setOrderId] = useState(false);

    React.useEffect(() => {
        getDates().catch((e) => console.log(e));
        }, []);

    function selectDate(e) {
        let orderId = e.target.value;
        if (orderId === "") {
            setOrderState(null);
        }
        else {
            getOrder(orderId);
            setOrderId(orderId);
        }
    }

    async function getDates() {
        let getList = await fetchData("listOrders");
        if (getList !== false) {
            setSelectOrder(getList);
        }
        else {
            setSelectOrder(false);
        }
    }

    let selectOrderBar = "";
    if (selectOrder === null) {
        selectOrderBar = (<h4>Loading ...</h4>);
    }
    else if (selectOrder === false) {
        selectOrderBar = (<p>Error - couldn't fetch data</p>);
    }
    else {
        let orderList = [];
        for (const key in selectOrder) {
            orderList.push({orderId: key, name: selectOrder[key].name});
        }
        let options = [];
        let i = 0;
        while (i < orderList.length) {
            options.push(<option value={orderList[i].orderId}>{orderList[i].name}</option>)
            i++;
        }

        selectOrderBar = (
            <div className="bar">
                <div className="dropdown_label">Select Date:</div>
                <select name="dates" id="dates" onChange={selectDate} defaultValue={"choose"}
                        className="dropdown__selector">
                    <option value={""}>choose</option>
                    {options}
                </select>
            </div>
        )
    }

    async function getOrder(name) {
        setOrderState("loading");
        fetchData("myOrder", {orderId: name}).then(res => {
            setOrderState(res);
        });
    }

    let orderDetails = "";
    if (orderState === null) {
        orderDetails = "";
    }
    else if (orderState === false) {
        orderDetails = (<div className="card"><p>Error, couldn't fetch data, reload to try again.</p></div>);
    }
    else if (orderState === "loading") {
        orderDetails = (<div className="card"><h4>Loading ...</h4></div>);
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
                    <h3>Total Cost: </h3>
                </div>
            );
        }
        else {
            console.log(selectOrder);
            console.log(orderId);
            orderDetails = (
                <Selection orderId={selectOrder[orderId].name} />
            );
        }
    }


    return (
        <div className="page">
            <div className="card">
                {selectOrderBar}
            </div>
            {orderDetails}
        </div>
    );
}