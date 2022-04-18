import React, {useState} from 'react';



export default function OrderDisplay(props) {

    const [expand, setExpand] = useState(false);




    let output = "";
    if (expand === false) {
        output = (
            <div className="card">
                <p>{JSON.stringify(props.data)}</p>
            </div>
        )
    }




    return output;
}