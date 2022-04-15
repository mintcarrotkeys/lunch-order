import React, {useState} from 'react';
import {fetchData} from "../auth";
import Selection from "../Components/Selection";






export default function Order(props) {

    const [orderState, setOrderState] = useState(null);
    const [selectOrder, setSelectOrder] = useState((<div className="bar">Loading ...</div>));

    React.useEffect(() => {
        getDates().then(res => setSelectOrder(res)).catch((e) => console.log(e));
        }, []);

    function selectDate(e) {
        let orderId = e.target.value;
        if (orderId === "") {
            setOrderState(null);
        }
        else {
            getOrder(orderId);
        }
    }

    async function getDates() {
        let getList = await fetchData("listOrders");
        console.log(getList);
        if (getList !== false) {
            let orderList = [];
            for (const key in getList) {
                orderList.push({orderId: key, name: getList[key].name});
            }
            let options = [];
            let i = 0;
            while (i < orderList.length) {
                options.push(<option value={orderList[i].orderId}>{orderList[i].name}</option>)
                i++;
            }

            return (
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
        else {
            return (<p>Error - couldn't fetch data</p>);
        }
    }

    async function getOrder(name) {
        setOrderState("loading");
        fetchData("myOrder", {orderId: name}).then(res => {
            console.log(res);
            setOrderState(res);
        });
    }

    let orderDetails = "";
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
                    <h3>Total Cost: </h3>
                </div>
            );
        }
        else {
            orderDetails = (
                <div className="card">
                    <h2>Add items</h2>
                    <h6>You have not placed an order yet</h6>
                    <Selection />
                </div>
            );
        }
    }


    return (
        <div className="page">
            <div className="card">
                {selectOrder}
            </div>
            {orderDetails}
        </div>
    );
}