import React, {useState} from 'react';
import Badge from "./Badge";
import Button from "./Button";



export default function OrderDisplay(props) {

    const [expand, setExpand] = useState(false);
    const [paid, setPaid] = useState(props.data.paid);
    const [change, setChange] = useState(props.data.change);

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
                <div className="cart-row" key={i}>
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


        output = (
            <div className="card orderDisplay-box" >
                <div className="orderDisplay-top" onClick={handleClick}>
                    <h5>{data.name}</h5>
                    {tags}
                    {amount}
                </div>
                <div className="orderDisplay-cost top-border">
                    <div>Order Cost: {"$" + data.cost.toFixed(2)}</div>
                </div>
                <div className="orderDisplay-pay">
                    <div>Paid: $</div>
                    <input name="paid" id="paid" onChange={handlePay}
                        type="number" step={"0.01"}
                        className="input-text orderDisplay-pay-input" defaultValue={paid}
                    />
                    {(paid===data.paid ? "" : <Button type={'green'} text={'paid'} action={confirmPay} />)}
                </div>
                <div className="orderDisplay-pay">
                    <div>Change given: $</div>
                    <input name="change" id="change" onChange={handleChange}
                           type="number" step={"0.01"}
                           className="input-text orderDisplay-pay-input" defaultValue={change}
                    />
                    {(change===data.change ? "" : <Button type={'blue'} text={'changed'} action={confirmChange} />)}
                </div>
                <div className="orderDisplay-items top-border">
                    {cart}
                </div>
            </div>
        )
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


    return output;
}