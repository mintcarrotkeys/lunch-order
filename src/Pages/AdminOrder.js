import React, {useState} from 'react';
import {fetchData} from "../auth";
import Selection from "../Components/Selection";






export default function AdminOrder(props) {

    const [orderState, setOrderState] = useState(null);
    const orderId = props.orderId;

    React.useEffect(() => {
        getOrder().catch((e) => console.log(e));

    }, [props.userId, props.orderId]);

    async function getOrder() {
        setOrderState("loading");
        const res = await fetchData("seeAdminOrder", {orderId: props.orderId, userId: props.userId});
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
                    <h2>Order</h2>
                    <p>This order was placed on: </p>
                    <h6>{formattedTime}</h6>
                    <h4>Total cost: <b>{"$" + orderInfo.cost.toFixed(2)}</b></h4>
                    <h4>Paid: <b>{"$" + orderInfo.paid.toFixed(2)}</b></h4>
                    <br />
                    <h2>Items</h2>
                    {cartDisplay}
                    <br />
                    <p>To delete an order, reload and go to the 'Collect Money' tab.</p>
                </div>
            );
        }
        else {
            orderDetails = (
                <div className="stack">
                    <Selection orderName={orderState.orderName} orderId={orderId}
                               menu={orderState.menu} admin={true} userId={props.userId}
                               actionAfterOrder={props.actionAfterOrder}
                    />
                </div>
            );
        }
    }


    return (
        <div className="page">
            {orderDetails}
        </div>
    );
}