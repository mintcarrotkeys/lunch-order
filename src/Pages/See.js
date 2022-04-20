import React, {useState} from 'react';
import {fetchData} from "../auth";
import Nav from "../Components/Nav";
import OrderDisplay from "../Components/OrderDisplay";
import ItemDisplay from "../Components/ItemDisplay";
import Order from "./Order";



export default function See(props) {

    const [orderState, setOrderState] = useState(null);
    const [selectOrder, setSelectOrder] = useState(null);
    const [orderId, setOrderId] = useState(false);
    const [page, setPage] = useState(null);
    const [addOrderUser, setAddOrderUser] = useState(null);


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
            {name:"Items", code:"items"},
            {name:"Add order", code:"add"}
        ];

        let sortOrders = [];
        for (const key in orderState.orders) {
            sortOrders.push(orderState.orders[key]);
        }
        function comp(a, b) {
            if (a.name < b.name) {return -1}
            else if (a.name > b.name) {return 1}
            else {return 0}
        }
        sortOrders.sort(comp);
        let orderList = [];
        for (const order of sortOrders) {
            orderList.push(
                <OrderDisplay data={order} key={order.userId} updateVal={updateVal}
                              menu={orderState.menu} orderName={selectOrder[orderId].name} />
            )
        }

        let noOrder = [];
        for (const user of orderState.noOrder) {
            noOrder.push(user.name);
        }

        let pageContent = "";
        if (page === "orders") {
            pageContent = (
                <div className="stack">
                    <div className="card" style={{margin: "10px 10px 3px 10px", padding: "0px"}}>
                        <h3>Users who placed orders</h3>
                    </div>
                    {orderList}
                    <div className="card" style={{margin: "10px 10px 3px 10px", padding: "0px"}}>
                        <h3>Users who did not place an order</h3>
                        <p>Check with these users to confirm if they want to place a lunch order.</p>
                        <h4>{noOrder.join(', ')}</h4>
                    </div>
                </div>
            );
        }
        else if (page === "items") {
            let itemCount = 0;
            let totalCost = 0;
            let comboCount = 0;
            let menu = orderState.menu;
            let itemTree = {};
            for (const key in orderState.orders) {
                let order = orderState.orders[key];
                let user = order.name;
                for (const item of order.items) {
                    let uniqueTag = item.itemId + ":" + item.side + ":" + item.note;
                    if (itemTree.hasOwnProperty(uniqueTag)) {
                        itemTree[uniqueTag].orders.push(user);
                    }
                    else {
                        itemTree[uniqueTag] = {
                            orders: [user], itemId: item.itemId, side: item.side,
                            note: item.note, cost: menu[item.itemId].cost, name: menu[item.itemId].name };
                    }
                    itemCount += 1;
                    if (menu[item.itemId].combo) {
                        comboCount += 1;
                    }
                    totalCost += menu[item.itemId].cost;
                }
            }
            let itemList = [];
            for (const key in itemTree) {
                let item = itemTree[key];
                itemList.push(
                    <ItemDisplay data={item} />
                )
            }

            pageContent = (
                <div className="stack">
                    <div className="card">
                        <h3>
                            number of items:
                            <span style={{fontWeight: 500, fontSize: "20px"}}>{" " + itemCount}</span>
                        </h3>
                        <h3>
                            Pay store:
                            <span style={{fontWeight: 500, fontSize: "20px"}}>{" $" + totalCost.toFixed(2)}</span>
                        </h3>
                        <h3>
                            number of combos:
                            <span style={{fontWeight: 500, fontSize: "20px"}}>{" " + comboCount}</span>
                        </h3>
                    </div>
                    {itemList}
                </div>
            );
        }
        else if (page === 'add') {
            let noOrderUsers = [];
            for (const user of orderState.noOrder) {
                noOrderUsers.push(
                    <option value={user.userId}>{user.name}</option>
                )
            }

            pageContent = (
                <div className="stack">
                    <div className="card">
                        <h4>You may add an order on behalf of a user.</h4>
                        <p>Note that you can continue to do this after an order's deadline has passed.</p>
                        <div className="bar">
                            <h4 className="dropdown_label">Select user: </h4>
                            <select name="user" id="user" onChange={selectUser} defaultValue={"choose"}
                                    className="dropdown__selector">
                                <option value={""}>choose</option>
                                {noOrderUsers}
                            </select>
                        </div>
                    </div>

                    {(addOrderUser!==null ? <Order admin={true} userId={addOrderUser} /> : "")}
                </div>
            )
        }

        orderDetails = (
            <div className="stack">
                <Nav setPage={changePage} currentPage={page} allowed={allowedPages} />
                {pageContent}
            </div>
        );
    }

    function changePage(selected) {
        setPage(selected)
    }

    function updateVal(userId, key, value) {
        if (key === 'delete') {
            fetchData("deleteOrder", {orderId: orderId, userId: userId}).then(res => {
                if (res) {
                    let data = {...orderState};
                    delete data.orders[userId];
                    setOrderState(data);
                }
                else {
                    console.log("error with setting payment stuff.")
                }
            })
        }
        else {
            let ask = "";
            if (key === 'paid') {
                ask = "setPay"
            } else if (key === 'change') {
                ask = "setChange"
            }
            fetchData(ask, {value: value, orderId: orderId, userId: userId}).then(res => {
                if (res) {
                    let data = {...orderState};
                    data.orders[userId][key] = value;
                    setOrderState(data);
                }
                else {
                    console.log("error with setting payment stuff.")
                }
            })
        }
    }

    function selectUser(e) {

        if (e.target.value === "") {
            setAddOrderUser(null);
        }
        else {
            setAddOrderUser(e.target.value);
        }
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