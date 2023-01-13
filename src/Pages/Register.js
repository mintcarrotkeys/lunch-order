import React, {useState} from 'react';
import Banner from "../Components/Banner";

export default function Register(props) {
    const [state, setState] = useState(0);

    let page = "";
    if (state === 0) {
        page = (
            <div className="stack">
                <h1 className="login__title">Register</h1>
            </div>
        )
    }

    return page;
}