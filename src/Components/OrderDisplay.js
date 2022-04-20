import React, {useState} from 'react';
import Badge from "./Badge";
import ThinButton from "./ThinButton";
import Notice from "./Notice";



export default function OrderDisplay(props) {

    const [expand, setExpand] = useState(false);
    const [paid, setPaid] = useState(props.data.paid);
    const [change, setChange] = useState(props.data.change);
    const [remove, setRemove] = useState(false);

    let data = props.data;

    function handleClick() {
        setExpand(!expand)
    }

    let tags = "";
    let amount = "";

    if (data.paid < data.cost) {
        tags = (
            <Badge type={'red'} text={'pay'} />
        );
        if (data.paid === 0) {
            amount = (
                <h5>{"$" + (data.cost - data.paid).toFixed(2)}</h5>
            )
        }
        else {
            amount = (
                <h5>
                    {"$" + data.cost.toFixed(2)}
                    {" - "}
                    {"$" + data.paid.toFixed(2)}
                    {" = "}
                    {"$" + (data.cost - data.paid).toFixed(2)}
                </h5>
            )
        }
    }
    else if ((data.paid) === (data.cost + data.change)) {
        tags = (
            <Badge type={'green'} text={'done'} />
        );
    }
    else if (data.paid > data.cost) {
        tags = (
            <Badge type={'blue'} text={'change'} />
        );
        amount = (
            <h5>{"$" + (data.paid - data.cost - data.change).toFixed(2)}</h5>
        )
    }

    const time = new Date(data.timestamp);
    let formattedTime = (
        (time.getDate() < 10 ? "0" : "") + time.getDate().toString() + "/"
        + (time.getMonth() < 9 ? "0" : "") + (1 + time.getMonth()).toString() + "/"
        + time.getFullYear().toString() + " "
        +  (time.getHours() < 10 ? "0" : "") + time.getHours().toString() + ":"
        +  (time.getMinutes() < 10 ? "0" : "") + time.getMinutes().toString()
    );

    let output = "";
    if (expand === false) {
        output = (
            <div className="card orderDisplay-box">
                <div className="orderDisplay-top" onClick={handleClick}>
                    <h5>{data.name}</h5>
                    {tags}
                    {amount}
                </div>
            </div>
        )
    }
    else {
        let cart = [];
        let i = 0;
        for (const item of data.items) {
            cart.push(
                <div className="cart-row orderDisplay-item" key={i}>
                    <div className="cart-left">
                        <h6>
                            {props.menu[item.itemId].name}
                        </h6>
                        <p className="cart-notes">
                            {item.side}
                            {item.side !== "" && item.note !== "" ? ", " : ""}
                            {item.note}
                        </p>
                    </div>
                    <h6 className="cart-price">
                        {"$" + item.price.toFixed(2)}
                    </h6>
                </div>
            )
            i++;
        }

        const deleteNotice = (
            <div className="stack">
                <h2>Confirm delete</h2>
                <h4>Are you sure the user:</h4>
                <h3>{data.name}</h3>
                <h4>wish to <b>delete</b> their order for:</h4>
                <h3>{props.orderName}</h3>
            </div>
        )

        output = (
            <div className="card orderDisplay-box" >
                <div className="orderDisplay-top" onClick={handleClick}>
                    <h5>{data.name}</h5>
                    {tags}
                    {amount}
                </div>
                <div className="orderDisplay-cost top-border">
                    <div className="orderDisplay-box">Order Cost: {"$" + data.cost.toFixed(2)}</div>
                    <div>Paid: $</div>
                    <input name="paid" id="paid" onChange={handlePay}
                        type="number" step={"0.01"}
                        className="input-text orderDisplay-pay-input" defaultValue={paid}
                    />
                    <ThinButton type={'green'} text={'paid'} action={confirmPay} style={(paid===data.paid ? {} : {visibility: 'hidden'})} />
                    <div>Change given: $</div>
                    <input name="change" id="change" onChange={handleChange}
                           type="number" step={"0.01"}
                           className="input-text orderDisplay-pay-input" defaultValue={change}
                    />
                    <ThinButton type={'blue'} text={'changed'} action={confirmChange} style={(change===data.change ? {} : {visibility: 'hidden'})} />
                    <p>Order placed: {formattedTime}</p>
                    <ThinButton type={'red'} text={'delete'} action={deleteOrder} />
                </div>
                <div className="top-border" onClick={handleClick}>
                    {cart}
                </div>
                {(remove ? <Notice text={deleteNotice} close={cancelDelete} type={"yellow"}
                                   button1={{text: "Delete Order", type: "red"}} button1Action={confirmDelete} /> : "")}
            </div>
        );
    }

    function handlePay(e) {
        if (+e.target.value !== NaN) {
            setPaid((+e.target.value));
        }
    }
    function confirmPay(e) {
        props.updateVal(data.userId, "paid", paid);
    }

    function handleChange(e) {
        if (+e.target.value !== NaN) {
            setChange((+e.target.value));
        }
    }
    function confirmChange(e) {
        props.updateVal(data.userId, "change", change);
    }
    function deleteOrder(e) {
        setRemove(true);
    }
    function cancelDelete() {
        setRemove(false);
    }
    function confirmDelete() {
        props.updateVal(data.userId, "delete", true);
    }

    return output;
}