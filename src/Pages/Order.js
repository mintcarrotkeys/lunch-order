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
        const res = await fetchData("myOrder", {orderId: name});
        if (res !== false) {
            const menu = await fetchData("menu");
            if (menu !== false) {
                setOrderState({...res, 'menu': menu});
                return true;
            }
        }
        setOrderState(false);
        return false;
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
            const orderInfo = orderState.order;
            const time = new Date(orderInfo.timestamp);
            let formattedTime = (
                (time.getDate() < 10 ? "0" : "") + time.getDate().toString() + "/"
                + (time.getMonth() < 9 ? "0" : "") + (1 + time.getMonth()).toString() + "/"
                + time.getFullYear().toString() + " "
                +  (time.getHours() < 10 ? "0" : "") + time.getHours().toString() + ":"
                +  (time.getMinutes() < 10 ? "0" : "") + time.getMinutes().toString()
            );

            let changeDue = "";
            let changeGiven = "";
            if (orderInfo.paid >= orderInfo.cost) {
                changeGiven = (
                    <h4>
                        Change Given:
                        <b>{"$" + orderInfo.change.toFixed(2)}</b>
                    </h4>
                );
                changeDue = (
                    <h4>
                        Change Due:
                        <b>
                            {"$" + (orderInfo.paid - orderInfo.cost - orderInfo.change).toFixed(2)}
                        </b>
                    </h4>
                )
            }
            let cartDisplay = [];
            let i = 0;
            for (const item of orderInfo.items) {
                cartDisplay.push(
                    <div className="ticket-row cart-row" key={i}>
                        <div className="cart-left">
                            <h5>
                                {orderState.menu[item.itemId].name}
                            </h5>
                            <p className="cart-notes">
                                {item.side}
                                {item.side !== "" && item.note !== "" ? ", " : ""}
                                {item.note}
                            </p>
                        </div>
                        <h4 className="cart-price">
                            {"$" + item.price.toFixed(2)}
                        </h4>
                    </div>
                )
                i++;
            }

            orderDetails = (
                <div className="card">
                    <h2>Your Order</h2>
                    <p>You placed the order on: </p>
                    <h6>{formattedTime}</h6>
                    <h4>Total cost: <b>{"$" + orderInfo.cost.toFixed(2)}</b></h4>
                    <h4>Paid: <b>{"$" + orderInfo.paid.toFixed(2)}</b></h4>
                    {changeGiven}
                    {changeDue}
                    <br />
                    <h2>Items</h2>
                    {cartDisplay}
                    <br />
                    <p>To change or cancel your order, contact the person managing lunch orders.</p>
                </div>
            );
        }
        else {
            console.log(selectOrder);
            console.log(orderId);
            orderDetails = (
                <Selection orderName={selectOrder[orderId].name} orderId={orderId} menu={orderState.menu} />
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