import React, {useState} from 'react';
import {fetchData} from "../auth";
import Banner from "./Banner";


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
                <div className="add-item" onClick={startAddItem}>
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
            for (const side in menu[newItem.itemId].sides) {
                sides.push(<option value={side}>{side}</option>);
            }
            sidesBox = (
                <select name="item-sides" id="item-sides" onChange={setItemSide} defaultValue={"choose side"}
                        className="dropdown__selector">
                    <option value={""}>choose side</option>
                    {sides}
                </select>
            );
        }
        addItem = (
            <div className="ticket-row">
                <select name="item-name" id="item-name" onChange={setItemName} defaultValue={"choose item"}
                        className="dropdown__selector">
                    <option value={""}>choose item</option>
                    {options}
                </select>
                <div className="item-price">
                    {(newItem.itemId !== "" ? ("$" + menu[newItem.itemId].price.toFixed(2)) : " ")}
                </div>
                {sidesBox}
                <div className="item-notes">
                    <input type="text" id="item-notes" name="item-notes" maxLength={200}
                           placeholder="add special requirements here" spellCheck={true} autoCorrect={"on"}
                           onChange={setItemNotes}
                    />
                </div>
                {errorMessage}
                <div className="item-buttons">
                    <div className="button button-cancel" onClick={itemCancel}>Cancel</div>
                    <div className="button button-submit" onClick={itemSubmit}>Add to order</div>
                </div>
            </div>
        )
    }

    function setItemName(e) {
        setNewItem({itemId: e.target.value, note: "", side: ""});
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
            cart.push(newItem);
            setNewItem(false);
        }
    }

    let cartDisplay = [];
    for (const item of cart) {
        cartDisplay.push(
            <div className="ticket-row">
                <h4 className="cart-name">
                    {item.itemId}
                </h4>
                <h4 className="cart-price">
                    {menu[item.itemId].price}
                </h4>
                <p className="cart-notes">
                    {item.side}
                    {item.side !== "" && item.note !== "" ? ", " : ""}
                    {item.note}
                </p>
            </div>
        )
    }

    let output = (
        <div className="card">
            <h2>Add items</h2>
            <h6>You have not placed an order yet</h6>
            <div className="ticket">
                {cartDisplay}
                {addItem}
            </div>
        </div>
    );


    return output;
}