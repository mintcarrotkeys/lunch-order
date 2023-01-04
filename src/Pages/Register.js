import React, {useState} from 'react';

export default function Register(props) {
    const [state, setState] = useState(0);

    let page = "";
    if (state === 0) {
        page = (
            <h1 className="login__title">Register</h1>

        )
    }

    return page;
}