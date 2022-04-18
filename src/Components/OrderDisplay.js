import React, {useState} from 'react';
import Badge from "./Badge";
import Button from "./Button";



export default function OrderDisplay(props) {

    const [expand, setExpand] = useState(false);
    const [paid, setPaid] = useState(props.data.paid);

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
        amount = (
            <h5>{"$" + (data.cost - data.paid).toFixed(2)}</h5>
        )
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
            <h5>{"$" + (data.paid - data.cost).toFixed(2)}</h5>
        )
    }


    let output = "";
    if (expand === false) {
        output = (
            <div className="card">
                <div className="orderDisplay-top" onClick={handleClick}>
                    <h5>{data.name}</h5>
                    {tags}
                    {amount}
                </div>
            </div>
        )
    }
    else {
        output = (
            <div className="card" style={{margin: '5px', padding: '2px 5px'}}>
                <div className="orderDisplay-top" onClick={handleClick}>
                    <h5>{data.name}</h5>
                    {tags}
                    {amount}
                </div>
                <div className="orderDisplay-pay">
                    <div>Paid: $</div>
                    <input name="paid" id="paid" onClick={handlePay}
                        type="number" step={"0.01"}
                        className="input-text" defaultValue={paid}
                    />
                    {(paid===data.paid ? "" : <Button type={'green'} text={'paid'} action={confirmPay} />)}
                </div>
                <div className="orderDisplay-items">

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


    return output;
}