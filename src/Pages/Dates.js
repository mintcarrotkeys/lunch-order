import React, {useState} from 'react';
import {fetchData, login} from "../auth";
import ThinButton from "../Components/ThinButton";
import Notice from "../Components/Notice";



export default function Dates() {
    const [data, setData] = useState(null);
    const [selectDeleteDate, setSelectDeleteDate] = useState(false);
    const [addNewDate, setAddNewDate] = useState({name: '', dueDate: Date.now()})
    const [bannerNotice, setBannerNotice] = useState("");

    React.useEffect(() => {
        fetchData("listOrders").then(res => setData(res));
    }, []);

    let page = "";
    if (data === null) {
        page = (
            <div className="card">
                <div className="bar">
                    <h4>Loading ...</h4>
                </div>
            </div>
        )
    }
    else if (data === false) {
        page = (
            <p>Error - couldn't fetch data</p>
        )
    }
    else {
        let orders = [];
        let sortOrders = [];
        let options = [];
        for (const orderId in data) {
            sortOrders.push({...data[orderId], 'orderId': orderId})
        }
        function comp(a, b) {
            if (a.dueDate < b.dueDate) {return -1}
            else if (a.dueDate > b.dueDate) {return 1}
            else {return 0}
        }
        sortOrders.sort(comp);
        orders.push(<h6 className="grid-item">order name/date</h6>)
        orders.push(<h6 className="grid-item">order due</h6>)
        for (const item of sortOrders) {
            const time = new Date(item.dueDate);
            let formattedTime = (
                (time.getDate() < 10 ? "0" : "") + time.getDate().toString() + "/"
                + (time.getMonth() < 9 ? "0" : "") + (1 + time.getMonth()).toString() + "/"
                + time.getFullYear().toString() + " "
                +  (time.getHours() < 10 ? "0" : "") + time.getHours().toString() + ":"
                +  (time.getMinutes() < 10 ? "0" : "") + time.getMinutes().toString()
            );
            orders.push(<h5 className="grid-item">{item.name}</h5>)
            orders.push(<h4 className="grid-item">{formattedTime}</h4>)
            options.push(<option key={item.orderId} value={item.orderId}>{item.name}</option>)
        }
        const time = new Date(addNewDate.dueDate);
        let dateVal = (
            time.getFullYear().toString() + '-'
            + (time.getMonth() < 9 ? "0" : "") + (1 + time.getMonth()).toString() + "-"
            + (time.getDate() < 10 ? "0" : "") + time.getDate().toString() + "T"
            +  (time.getHours() < 10 ? "0" : "") + time.getHours().toString() + ":"
            +  (time.getMinutes() < 10 ? "0" : "") + time.getMinutes().toString()
        );

        page = (
            <div className="stack">
                <div className="card grid-box orderDates">
                    {orders}
                </div>
                <div className="card">
                    <h3>Add an order date</h3>
                    <h4>Order name:</h4>
                    <p>suggested names: 02/03 or wk 4 saturday</p>
                    <input type="text"
                           maxLength={30}
                           minLength={1}
                           className="input-text"
                           id="add order date"
                           name="add order date"
                           placeholder="order name/date"
                           onChange={(e) => {
                               setAddNewDate({...addNewDate, name: e.target.value})
                           }}
                    />
                    <h4>Order cutoff:</h4>
                    <p>This is the latest time that users can place an order for themselves. Admins can continue to add orders for users after this time.</p>
                    <input id="duedate" type="datetime-local" name="duedate" value={dateVal} className="dropdown__selector"
                           onChange={(e) => {
                               setAddNewDate({...addNewDate, dueDate: ((new Date(e.target.value)).getTime())})
                           }}
                    />
                    <div className="stack">
                        <ThinButton type={'green'} text={'add date'} action={addOrder} visible={true} />
                    </div>
                </div>
                <div className="card">
                    <h3>Delete an order date</h3>
                    <select name="dates" id="dates" onChange={selectDate} defaultValue={"choose"}
                            className="dropdown__selector">
                        <option value={""}>choose</option>
                        {options}
                    </select>
                    <div className="stack">
                        <ThinButton type={'red'} text={'delete date'} action={deleteOrder} visible={selectDeleteDate!==false} />
                    </div>
                </div>
            </div>
        )
    }

    function addOrder() {
        if (addNewDate.name !== '' && addNewDate.dueDate !== 0) {
            setBannerNotice(
                <Notice text={(<h3>Sending request ...</h3>)} noOffButton={true} type={"grey"} button1={null} />
            )
            fetchData('addDate', {...addNewDate}).then(res => {
                if (res) {
                    setBannerNotice(
                        <Notice text={(<h3>Success</h3>)} close={() => {setBannerNotice('')}} type={"green"} button1={null} />
                    )
                }
                else {
                    setBannerNotice(
                        <Notice text={(<h3>Error: could not add order date.</h3>)} close={() => {setBannerNotice('')}} type={"red"} button1={null} />
                    )
                }
            })
        }
    }

    function selectDate(e) {
        if (e.target.value !== "") {
            setSelectDeleteDate(e.target.value);
        }
        else {
            setSelectDeleteDate(false);
        }
    }

    function deleteOrder(e) {
        const deleteNotice = (
            <div className="stack">
                <h2>Confirm delete order</h2>
                <h3>Are you sure you want to delete this order?</h3>
                <h3>{data[selectDeleteDate].name}</h3>
                <h4>Users would lose their order info.</h4>
                <h4>This action cannot be reversed.</h4>
            </div>
        )
        setBannerNotice(
            <Notice text={deleteNotice} close={cancelDelete} type={"yellow"}
                    button1={{text: "Delete Order", type: "red"}} button1Action={confirmDelete} />
        )
    }
    function cancelDelete() {
        setBannerNotice("");
    }
    function confirmDelete() {
        setBannerNotice(
            <Notice text={(<h3>Sending request ...</h3>)} noOffButton={true} type={"grey"} button1={null} />
        )
        fetchData("deleteDate", {orderId: selectDeleteDate}).then(res => {
            if (res) {
                let copy = {...data};
                delete copy[selectDeleteDate];
                setData(copy);
                setBannerNotice("");
                setSelectDeleteDate("");
            }
            else {
                setBannerNotice(
                    <Notice text={(<h3>Error: could not delete order date.</h3>)} close={cancelDelete} type={"red"} button1={null} />
                )
            }
        })
    }

    let output = (
        <div className="stack">
            {page}
            {bannerNotice}
        </div>

    );



    return output;
}