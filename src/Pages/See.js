import React, {useState} from 'react';
import {fetchData} from "../auth";
import Nav from "../Components/Nav";
import OrderDisplay from "../Components/OrderDisplay";
import ItemDisplay from "../Components/ItemDisplay";
import AdminOrder from "./AdminOrder";
import ReloadButton from "../Components/ReloadButton";


export default function See(props) {

    const [selectOrder, setSelectOrder] = useState(null);
    const [orderId, setOrderId] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);
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
            orderList.push({'orderId': key, name: selectOrder[key].name});
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
                    <option key={"Nothing"} value={""}>choose</option>
                    {options}
                </select>
            </div>
        )
    }

    function selectDate(e) {
        let input = e.target.value;
        if (input === "") {
            setOrderId(false);
            setOrderInfo(null);
        }
        else {
            setOrderId(input);
            setOrderInfo('loading');
            setPage(null);
            setAddOrderUser(null);
            getOrder(input);
        }
    }

    async function getOrder(orderId) {
        let getMenu = false;
        let seeOrder = false;
        await Promise.all([
            fetchData('menu').then(res => getMenu=res),
            fetchData('seeOrder', {orderId: orderId}).then(res => seeOrder=res),
        ]).catch(e => console.log(e));
        if (getMenu !== false && seeOrder !== false) {
            setOrderInfo({orderGroup:{...seeOrder}, menu:{...getMenu}})
            return true;
        }
        else {
            setOrderInfo(false);
            return false;
        }
    }

    let orderDetails = "";
    if (orderInfo === null) {
        orderDetails = "";
    }
    else if (orderInfo === 'loading') {
        orderDetails = (<div className="card"><h4>Loading ...</h4></div>);
    }
    else if (orderInfo === false) {
        orderDetails = (<div className="card"><p>Error - couldn't fetch data</p></div>);
    }
    else if (orderInfo.hasOwnProperty('orderGroup')) {
        let allowedPages = [
            {name:"Collect Money", code:"orders"},
            {name:"Items", code:"items"},
            {name:"Add order", code:"add"}
        ];

        let sortOrders = [];
        let currentOrder = orderInfo.orderGroup;

        for (const key in currentOrder.orders) {
            sortOrders.push(currentOrder.orders[key]);
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
                              menu={orderInfo.menu} orderName={selectOrder[orderId].name} />
            )
        }

        let noOrder = [];
        for (const user of currentOrder.noOrder) {
            noOrder.push(user.name);
        }

        let pageContent = "";
        if (page === "orders") {
            pageContent = (
                <div className="stack">
                    <div className="card" style={{margin: "10px 10px 3px 10px", padding: "0px", boxShadow: "none"}}>
                        <h3>Users who placed orders</h3>
                    </div>
                    {orderList}
                    <div className="card" style={{margin: "10px 10px 3px 10px", padding: "0px", boxShadow: "none"}}>
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
            let menu = orderInfo.menu;
            let itemTree = {};
            for (const key in currentOrder.orders) {
                let order = currentOrder.orders[key];
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
                    <ItemDisplay data={item} key={key} />
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
            for (const user of currentOrder.noOrder) {
                noOrderUsers.push(
                    <option value={user.userId} key={user.userId}>{user.name}</option>
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
                                <option value={""} key={"Nothing"}>choose</option>
                                {noOrderUsers}
                            </select>
                        </div>
                    </div>

                    {(addOrderUser!==null ? <AdminOrder admin={true} userId={addOrderUser} orderId={orderId}
                                                   actionAfterOrder={resetAfterOrder} /> : "")}
                </div>
            )
        }

        orderDetails = (
            <div className="stack">
                <div className="nav">
                    <Nav setPage={changePage} currentPage={page} allowed={allowedPages} />
                    <ReloadButton action={() => refreshData()} />
                </div>
                {pageContent}
            </div>
        );
    }

    async function refreshData() {
        return await getOrder(orderId);
    }

    function resetAfterOrder() {
        setAddOrderUser(null);
    }

    function changePage(selected) {
        setPage(selected)
    }

    function updateVal(userId, key, value) {
        if (key === 'delete') {
            fetchData("deleteOrder", {orderId: orderId, userId: userId}).then(res => {
                if (res) {
                    let data = {...orderInfo};
                    delete data.orderGroup.orders[userId];
                    setOrderInfo(data);
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
                    let data = {...orderInfo};
                    data.orderGroup.orders[userId][key] = value;
                    setOrderInfo(data);
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