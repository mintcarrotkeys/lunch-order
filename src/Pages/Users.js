import React, {useState} from 'react';
import {fetchData, login} from "../auth";
import Badge from "../Components/Badge";
import Button from "../Components/Button";
import Banner from "../Components/Banner";



export default function Users(props) {
    const [updateUsers, setUpdateUsers] = useState(false);

    const [newUser, setNewUser] = useState({id: '', name: '', scope: ''});

    const [fetch, setFetch] = useState(null);
    const [error, setError] = useState("");

    React.useEffect(() => {
        fetchData("getUsers").then(res => {
            setFetch(res);
        })
    }, [updateUsers]);

    let userList = "";
    if (fetch === null) {
        userList = (<h4>Loading ...</h4>);
    }
    else if (fetch === false) {
        userList = (<h4>Error - can't fetch data. Reload to try again.</h4>);
    }
    else if (fetch) {
        let users = [];
        for (const user in fetch) {
            let info = fetch[user];
            users.push(
                <div className="user-list-row">
                    <h5 className="user-list-name">{info.name}</h5>
                    <Badge type={(info.scope==="admin" ? 'yellow' : 'grey')}
                           text={(info.scope==="admin" ? 'admin' : 'user')}
                    />
                </div>
            );
        }
        userList = (
            <div>
                <div className="user-list">
                    <h2>users</h2>
                    {users}
                </div>
                <div className="user-add-box">
                    <h2>add user</h2>
                    <div className="user-add-top">
                        <input type="text"
                               maxLength={30}
                               minLength={1}
                               className="user-add-name input-text"
                               id="add user name"
                               name="add user name"
                               onChange={(e) => {
                                   setNewUser({...newUser, name: e.target.value})
                               }}
                        />
                        <select className="user-add-scope dropdown__selector"
                                onChange={(e) => {
                                    setNewUser({...newUser, scope: e.target.value})
                                }}
                                defaultValue={"select level"}
                        >
                            <option value={''}>select level</option>
                            <option value={'user'}>user</option>
                            <option value={'admin'}>admin</option>
                        </select>
                    </div>
                    <input type="text"
                           maxLength={30}
                           minLength={1}
                           className="user-add-id input-text"
                           id="add user id"
                           name="add user id"
                           onChange={(e) => {
                               setNewUser({...newUser, id: e.target.value})
                           }}
                    />
                    {error}
                    <Button text={"Add user"} type={'green'} action={addUser} />
                </div>
            </div>
        );
    }

    function addUser() {
        let input = newUser;
        if (input.id !== "" && input.name !== "" && input.scope !== '') {
            setError(<Banner message={'Adding user ... '} type={'yellow'} />);
            sendAddUser();
        }
        else {
            setError(<Banner message={'Please fill in all fields.'} type={'red'} />);
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
      <div className="card">
          {userList}
      </div>




    );

    return output;
}