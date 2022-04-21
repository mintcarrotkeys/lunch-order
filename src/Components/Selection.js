import React, {useState} from 'react';
import {fetchData} from "../auth";
import Banner from "./Banner";
import Button from "./Button";
import Notice from "./Notice";
import {randomString} from "../auth";


export default function Selection(props) {

    const [cart, setCart] = useState([]);
    const [newItem, setNewItem] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [finaliseOrder, setFinaliseOrder] = useState(false);

    const menu = props.menu;

    function startAddItem() {
        setNewItem({itemId: "", note: "", side: ""});
    }

    let options = [];
    for (const key in menu) {
        options.push(<option key={key} value={key}>{menu[key].name}</option>);
    }


    let addItem = "";
    if (newItem === false && cart.length < 50) {
        addItem = (
            <div className="ticket-row">
                <div className="add-item-start" onClick={startAddItem}>
                    <svg width="50px" height="50px" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                    </svg>
                </div>
            </div>
        );
    }
    else {
        let sidesBox = "";
        let sides = [];
        if (newItem.itemId !== "" && menu[newItem.itemId].sides.length > 0) {
            for (const side of menu[newItem.itemId].sides) {
                sides.push(<option key={side} value={side}>{side}</option>);
            }
            sidesBox = (
                <select name="item-sides" id="item-sides" key={newItem.itemId} onChange={setItemSide} defaultValue={"choose side"}
                        className="dropdown__selector item-sides">
                    <option value={""}>choose side</option>
                    {sides}
                </select>
            );
        }
        addItem = (
            <div className="ticket-row add-item-config">
                <div className="item-topBox">
                <select name="item-name" id="item-name" key={newItem.itemId} onChange={setItemName} defaultValue={newItem.itemId}
                        className="dropdown__selector item-name">
                    <option value={""}>choose item</option>
                    {options}
                </select>
                <div className="item-price">
                    {(newItem.itemId !== "" ? ("$" + menu[newItem.itemId].price.toFixed(2)) : " ")}
                </div>
                </div>
                {sidesBox}
                <textarea type="text" id="item-notes" name="item-notes" key={newItem.itemId}
                       className="input-text item-notes" maxLength={150}
                       placeholder="add special requirements here" spellCheck={true} autoCorrect={"on"}
                       onChange={setItemNotes} wrap="soft" rows={4}
                />
                {errorMessage}
                <div className="item-buttons">
                    <Button text="Cancel" type="grey" action={itemCancel} />
                    <Button text="Add item to order" type="green" action={itemSubmit} />
                </div>
            </div>
        )
    }

    function setItemName(e) {
        if (e.target.value !== newItem.itemId) {
            setNewItem({itemId: e.target.value, note: "", side: ""});
        }
        setErrorMessage("");

    }
    function setItemNotes(e) {
        setNewItem({...newItem, ...{note: e.target.value}});
    }
    function setItemSide(e) {
        setNewItem({...newItem, ...{side: e.target.value}});
    }
    function itemCancel(){
        setNewItem(false);
        setErrorMessage("");
    }
    function itemSubmit() {
        if (newItem.itemId === "") {
            setErrorMessage(<Banner message={"Please choose an item"} type={"red"} />);
            return;
        }
        else if (menu[newItem.itemId].sides.length > 0 && newItem.side === "") {
            setErrorMessage(<Banner message={"Please choose a side for this item"} type={"red"} />);
            return;
        }
        let formatNewItem = {...newItem};

        formatNewItem.note = formatNewItem.note.replaceAll("\n", " ");
        setCart([...cart, formatNewItem]);
        setNewItem(false);
        setErrorMessage("");
    }

    let cartDisplay = [];
    let i = 0;
    for (const item of cart) {
        cartDisplay.push(
            <div className="ticket-row cart-row" key={i}>
                <div className="cart-left">
                    <h4 className="cart-name">
                        {menu[item.itemId].name}
                    </h4>
                    <p className="cart-notes">
                        {item.side}
                        {item.side !== "" && item.note !== "" ? ", " : ""}
                        {item.note}
                    </p>
                </div>
                <h4 className="cart-price">
                    {"$" + menu[item.itemId].price.toFixed(2)}
                </h4>
                <div className="cart-delete" id={i} key={i} onClick={cartDelete}>
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                </div>
            </div>
        )
        i++;
    }

    function cartDelete(e) {
        const newCart = [...cart];
        newCart.splice(e.target.id, 1);
        setCart(newCart);
    }

    let submitOrder = "";
    if (cart.length > 0 && newItem === false && finaliseOrder === false) {
        let totalCost = 0;
        for (const item of cart) {
            totalCost += menu[item.itemId].price;
        }
        totalCost = totalCost.toFixed(2);
        submitOrder = (
            <div className="bar">
                <h2 className="total-price"><b>{"$" + totalCost}</b></h2>
                <Button text={"Place order"} type={"green"} action={placeOrder} />
            </div>
        )
    }

    function placeOrder() {
        setFinaliseOrder("yes");
    }

    if (finaliseOrder === "yes") {
        let cartItems = [];
        let totalCost = 0;
        let i = 0;
        for (const item of cart) {
            cartItems.push(<h6 key={i}>{menu[item.itemId].name}</h6>);
            totalCost += menu[item.itemId].price;
            i++;
        }
        let orderInfo = (
            <div className="notice-body">
                <h2 style={{marginBottom: "10px"}}><b>Confirm Order</b></h2>
                <p>Order for:</p>
                <h3><b>{props.orderName}</b></h3>
                {cartItems}
                <p>Total cost:</p>
                <h3><b>{"$" + totalCost.toFixed(2)}</b></h3>
                <p>{cart.length.toString() + " " + (cartItems.length === 1 ? "item" : "items")}</p>
            </div>
        );
        submitOrder = (
            <Notice text={orderInfo} close={cancelConfirm} button1Action={confirmOrder}
                    button1={{text: "Place order", type: "green"}} type={"grey"}
            />
        )
    }
    else if (finaliseOrder === "sending") {
        let text = (
            <div className="notice-body">
                <h2>Processing order ...</h2>
                <h2><b>Don't close this page.</b></h2>
            </div>
        );
        submitOrder = (
            <Notice text={text} close={null} noOffButton={true} button1={null} type={"yellow"} />
        );
    }
    else if (finaliseOrder === "done") {
        let successText = (
            <div className="notice-body">
                <h2>Success! <br /> Order Placed.</h2>
                <p>The order may take up to a minute to appear in this app.</p>
                <p>To change or delete your order, contact someone responsible for managing lunch orders.</p>
            </div>
        );
        submitOrder = (
            <Notice text={successText} close={orderFinished} button1={null} type={"green"} />
        );
    }
    else if (finaliseOrder === "fail") {
        let text = (
            <div className="notice-body">
                <h2>Error: the order could not be placed.</h2>
                <h2><b>Reload page to try again.</b></h2>
                <br />
                <h6>This may have been caused by:</h6>
                <p>- No internet connection.</p>
                <p>- Expired login token: reload page to login again.</p>
                <p>- Server error or overload.</p>
            </div>
        );
        submitOrder = (
            <Notice text={text} close={cancelConfirm}  type={"red"}
                    button1={{text: "Reload page", type: "grey"}} button1Action={reloadPage} />
        );
    }

    function reloadPage() {
        window.location.reload();
    }

    function orderFinished() {
        window.location.reload();
    }

    function cancelConfirm() {
        setFinaliseOrder(false);
    }
    function confirmOrder() {
        setFinaliseOrder("sending");
        sendOrder().then(res => {
            if (res) {
                setFinaliseOrder("done");
            }
            else {
                setFinaliseOrder("fail");
            }
        }).catch(e => console.log(e));
    }

    async function sendOrder() {
        let transactId = randomString(16);
        if (props.admin === false) {
            let response = await fetchData("placeOrder",
                {"orderId": props.orderId, "items": cart, "transactId": transactId});
            if (response.orderStatus === 'ok') {
                return true;
            }
            else if (response.orderStatus === "alreadyOrdered" && response.transactId === transactId) {
                return true;
            }
            else {
                response = await fetchData("placeOrder",
                    {"orderId": props.orderId, "items": cart, "transactId": transactId});
                if (response.orderStatus === 'ok') {
                    return true;
                }
                else if (response.orderStatus === "alreadyOrdered" && response.transactId === transactId) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            let response = await fetchData("placeAdminOrder",
                {"orderId": props.orderId, userId: props.userId, "items": cart, "transactId": transactId});
            if (response.orderStatus === 'ok') {
                return true;
            }
            else if (response.orderStatus === "alreadyOrdered" && response.transactId === transactId) {
                return true;
            }
            else {
                response = await fetchData("placeAdminOrder",
                    {"orderId": props.orderId, userId: props.userId, "items": cart, "transactId": transactId});
                if (response.orderStatus === 'ok') {
                    return true;
                } else if (response.orderStatus === "alreadyOrdered" && response.transactId === transactId) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    let output = (
        <div className="card">
            <h2>Add items</h2>
            <p>You have not placed an order yet</p>
            <div className="ticket">
                {cartDisplay}
                {addItem}
                {submitOrder}
            </div>
        </div>
    );


    return output;
}