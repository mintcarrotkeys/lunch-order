import React, {useState} from 'react';
import {fetchData} from "../auth";
import Badge from "../Components/Badge";
import Button from "../Components/Button";
import Banner from "../Components/Banner";
import GetLinkingCode from "../Components/GetLinkingCode";


export default function Users(props) {
    const [updateUsers, setUpdateUsers] = useState(false);

    const [newUser, setNewUser] = useState({name: '', scope: ''});

    const [fetchUsers, setFetchUsers] = useState(null);
    const [error, setError] = useState("");

    React.useEffect(() => {
        fetchData("getUsers").then(res => {
            setFetchUsers(res);
        })
    }, [updateUsers]);

    let userList = "";
    if (fetchUsers === null) {
        userList = (<h4>Loading ...</h4>);
    }
    else if (fetchUsers === false) {
        userList = (<h4>Error - can't fetch data. Reload to try again.</h4>);
    }
    else if (fetchUsers) {
        let users = [];
        let sortUsers = [];
        for (const userInfo in fetchUsers.users) {
            sortUsers.push(fetchUsers.users[userInfo]);
        }
        function comp(a, b) {
            if (a.name < b.name) {return -1}
            else if (a.name > b.name) {return 1}
            else {return 0}
        }
        sortUsers.sort(comp);
        for (const user of sortUsers) {
            users.push(
                <div className="user-list-row" id={user.name} key={user.userId} >
                    <h5 className="user-list-name">{user.name}</h5>
                    <Badge type={(user.scope==="admin" ? 'yellow' : 'grey')}
                           text={(user.scope==="admin" ? 'admin' : 'user')}
                    />
                    {user.hasOwnProperty("SBHS") ? <Badge type={'blue'} text={'SBHS'} /> : ""}
                    {user.hasOwnProperty("Discord") ? <Badge type={'purple'} text={'discord'} /> : ""}
                    {user.hasOwnProperty("Google") ? <Badge type={'red'} text={'google'} /> : ""}
                </div>
            );
        }
        userList = (
                <div className="user-list">
                    <h2>users</h2>
                    {users}
                </div>
        );
    }

    const addUserBox = (
        <div className="user-add-box">
            <h2>add user</h2>
            <div className="user-add-top">
                <input type="text"
                       maxLength={30}
                       minLength={1}
                       className="user-add-name input-text"
                       id="add user name"
                       name="add user name"
                       placeholder="username"
                       onChange={(e) => {
                           setNewUser({...newUser, name: e.target.value});
                           setError("")
                       }}
                />
                <select className="user-add-scope dropdown__selector"
                        onChange={(e) => {
                            setNewUser({...newUser, scope: e.target.value});
                            setError("")
                        }}
                        defaultValue={"select level"}
                >
                    <option value={''}>select level</option>
                    <option value={'user'}>user</option>
                    <option value={'admin'}>admin</option>
                </select>
            </div>
            {error}
            <Button text={"Add user"} type={'green'} action={addUser} />
        </div>
    )

    function addUser() {
        let input = {...newUser};
        let flag = false;
        for (const user in fetchUsers.users) {
            if (input.name === fetchUsers.users[user].name) {
                flag = true;
            }
        }
        if (input.name === "" || input.scope === "") {
            setError(<Banner message={'Please fill in all fields.'} type={'red'} />);
        }
        else if (flag) {
            setError(<Banner message={'This username already exists.'} type={'red'} />);
        }
        else {
            setError(<Banner message={'Adding user ... '} type={'yellow'} />);
            sendAddUser();
        }
    }

    async function sendAddUser() {
        let res = await fetchData('addUser', {...newUser});
        if (res) {
            setError(<Banner message={'Success: user added.'} type={'green'} />);
            setUpdateUsers(!updateUsers);
        }
        else {
            setError(<Banner message={'Error: could not add user.'} type={'red'} />);
        }
    }


    let output = (
        <div className="stack">
            <div className="card">
              {userList}
            </div>
            {
                (fetchUsers ? (
                    <div className="stack">
                        <div className="card">
                            {addUserBox}
                        </div>
                        <GetLinkingCode users={fetchUsers} />
                    </div>
                ) : "")
            }
        </div>


    );

    return output;
}