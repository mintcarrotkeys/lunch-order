import React, {useState} from 'react';




export default function ItemDisplay(props) {

    const [expand, setExpand] = useState(false);
    let item = props.data;

    function handleClick() {
        setExpand(!expand);
    }

    let output = "";
    if (expand) {

        output = (
            <div className="card orderDisplay-box">
                <div className="orderDisplay-top" onClick={handleClick}>
                    <div className="numberBox">{item.orders.length}</div>
                    <h5>{item.name}</h5>
                    <h4 className="cart-notes">
                        {item.side}
                        {item.side !== "" && item.note !== "" ? ", " : ""}
                        {item.note}
                    </h4>
                </div>
                <div className="top-border">
                    <div className="orderDisplay-item">
                        <h4>{"Store price: $" + item.cost.toFixed(2)}</h4>
                    </div>
                </div>
                <div className="top-border">
                    <div className="orderDisplay-item">
                        <h4>{item.orders.join(", ")}</h4>
                    </div>
                </div>
            </div>
        );
    }
    else {
        output = (
            <div className="card orderDisplay-box">
                <div className="orderDisplay-top" onClick={handleClick}>
                    <div className="numberBox">{item.orders.length}</div>
                    <h5>{item.name}</h5>
                    <h4 className="cart-notes">
                        {item.side}
                        {item.side !== "" && item.note !== "" ? ", " : ""}
                        {item.note}
                    </h4>
                </div>
            </div>
        );
    }




    return output;
}