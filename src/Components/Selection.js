import React, {useState} from 'react';
import {fetchData} from "../auth";
import Banner from "./Banner";
import Button from "./Button";


export default function Selection(props) {

    const [cart, setCart] = useState([]);
    const [newItem, setNewItem] = useState(false);
    const [menu, setMenu] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    React.useEffect(() => {
        fetchData("menu").then(res => setMenu(res)).catch((e) => console.log(e));
    }, []);

    if (menu === null) {
        return (
            <div className="card">
                <p>Loading ...</p>
            </div>
        );
    }
    else if (menu === false) {
        return (
            <div className="card">
                <p>Error - couldn't fetch menu. Please reload to try again.</p>
            </div>
        );
    }

    function startAddItem() {
        setNewItem({itemId: "", note: "", side: ""});
    }

    let options = [];
    for (const key in menu) {
        options.push(<option value={key}>{menu[key].name}</option>);
    }


    let addItem = "";
    if (newItem === false) {
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
                sides.push(<option value={side}>{side}</option>);
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
                <select name="item-name" id="item-name" key={newItem.itemId} onChange={setItemName} defaultValue={"choose item"}
                        className="dropdown__selector item-name">
                    <option value={""}>choose item</option>
                    {options}
                </select>
                <div className="item-price">
                    {(newItem.itemId !== "" ? ("$" + menu[newItem.itemId].price.toFixed(2)) : " ")}
                </div>
                </div>
                {sidesBox}
                <input type="text" id="item-notes" name="item-notes" key={newItem.itemId}
                       className="input-text item-notes" maxLength={200}
                       placeholder="add special requirements here" spellCheck={true} autoCorrect={"on"}
                       onChange={setItemNotes}
                />
                {errorMessage}
                <div className="item-buttons">
                    <Button text="Cancel" type="grey" action={itemCancel} id={"cancelItem"} />
                    <Button text="Add to order" type="green" action={itemSubmit} id={"submitItem"} />
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
    function itemCancel(e){
        setNewItem(false);
        setErrorMessage("");
    }
    function itemSubmit(e) {
        let valid = true;
        if (newItem.itemId === "") {
            valid = false;
            setErrorMessage(<Banner message={"Please choose an item"} type={"warning"} />);
        }
        if (menu[newItem.itemId].sides.length > 0 && newItem.side == "") {
            valid = false;
            setErrorMessage(<Banner message={"Please choose a side for this item"} type={"warning"} />);
        }
        if (valid) {
            setCart([...cart, newItem]);
            setNewItem(false);
            setErrorMessage("");
        }
    }

    let cartDisplay = [];
    let i = 0;
    for (const item of cart) {
        cartDisplay.push(
            <div className="ticket-row" key={i}>
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
                    <svg width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
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

    let output = (
        <div className="card">
            <h2>Add items</h2>
            <p>You have not placed an order yet</p>
            <div className="ticket">
                {cartDisplay}
                {addItem}
            </div>
        </div>
    );


    return output;
}