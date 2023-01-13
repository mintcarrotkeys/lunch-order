import React, {useState} from 'react';
import {fetchData} from "../auth";
import Button from "./Button";
import Banner from "./Banner";




export default function GetLinkingCode(props) {

    const [selectedUser, setSelectedUser] = useState(null);
    const [banner, setBanner] = useState("");
    const [linkingCode, setLinkingCode] = useState(null);

    let userList = [];
    for (const user in props.users.users) {
        userList.push(props.users.users[user]);
    }

    function comp(a, b) {
        if (a.name < b.name) {return -1}
        else if (a.name > b.name) {return 1}
        else {return 0}
    }
    userList.sort(comp);
    let selectUserOptions = [];
    for (const user of userList) {
        selectUserOptions.push(
            <option value={user.userId} key={user.userId}>{user.name}</option>
        )
    }

    const form = (
        <div className="card">
            <h2>get linking code</h2>
            <p>Give this code to users when they need to add a login service.</p>
            <p>This code is single-use and valid for 2 hours.</p>
            <div className="user-add-top">
                <h4 className="dropdown_label">Select user: </h4>
                <select name="user" id="user" onChange={selectUser} defaultValue={"choose"}
                        className="dropdown__selector">
                    <option value={""} key={"Nothing"}>choose user</option>
                    {selectUserOptions}
                </select>
            </div>
            {banner}
            <Button text={"get code"} type={'green'} action={getCode} />
        </div>
    )

    function selectUser(e) {
        setBanner("");
        if (e.target.value === "") {
            setSelectedUser(null);
        }
        else {
            setSelectedUser(e.target.value);
            console.log(e.target.innerHTML);
        }
    }

    function getCode(e) {
        setLinkingCode(null);
        if (selectedUser !== null) {
            setBanner(<Banner message={'fetching linking code ... '} type={'yellow'} />);

            fetchCode(selectedUser, );
        }
        else {
            setBanner(<Banner message={'Please select a user.'} type={'red'} />);
        }
    }

    async function fetchCode(userId, userName) {
        let res = await fetchData('getLinkingCode', {"userId": userId});
        if (res) {
            setBanner(<Banner message={'Success.'} type={'green'} />);
            setLinkingCode({user: userName, code: res.code})
        }
        else {
            setBanner(<Banner message={'Error: could not add user.'} type={'red'} />);
        }
    }

    return form;
}