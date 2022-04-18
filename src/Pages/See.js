import React, {useState} from 'react';
import {fetchData} from "../auth";
import Nav from "../Components/Nav";
import OrderDisplay from "../Components/OrderDisplay";



export default function See(props) {

    const [orderState, setOrderState] = useState(null);
    const [selectOrder, setSelectOrder] = useState(null);
    const [orderId, setOrderId] = useState(false);
    const [page, setPage] = useState(null);


    React.useEffect(() => {
        getDates().catch((e) => console.log(e));
    }, []);

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
            options.push(<option key={i} value={orderList[i].orderId}>{orderList[i].name}</option>)
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

    async function getOrder(name) {
        setOrderState("loading");
        const res = await fetchData("seeOrder", {orderId: name});
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
    else {
        let allowedPages = [
            {name:"Collect Money", code:"orders"},
            {name:"Items", code:"items"}
        ];

        let orderList = [];
        console.log(orderState.orders)
        console.log(orderState)
        for (const key in orderState.orders) {
            console.log(key);
            let order = orderState.orders[key];
            orderList.push(
                <OrderDisplay data={order} key={order.userId} updateVal={updateVal} menu={orderState.menu} />
            )
        }

        let pageContent = "";
        if (page === "orders") {
            pageContent = (
                <div className="stack">
                    <h2>Users who placed orders</h2>
                    {orderList}
                </div>
            );
        }

        orderDetails = (
            <div>
                <Nav setPage={changePage} currentPage={page} allowed={allowedPages} />
                {pageContent}
            </div>
        );
    }

    function changePage(selected) {
        setPage(selected)
    }

    function updateVal(userId, key, value) {
        let ask = "";
        if (key === 'paid') {
            ask = "setPay"
        }
        else if (key === 'changed') {
            ask = "setChange"
        }
        fetchData(ask, {value: value, orderId: orderId, userId: userId}).then(res => {
            if (res) {
                setOrderState({
                    ...orderState,
                    ...{order: {...orderState.order, userId: {...orderState.order[userId], [key]: value}}}
                })
            }
            else {
                console.log("error with setting payment stuff.")
            }
        })
    }

    const output = (
        <div className="stack">
            <div className="card">
                {selectOrderBar}
            </div>
            {orderDetails}
        </div>
    );


    return output;
}