import React, {useState} from 'react';


export default function Selection(props) {

    const [cart, setCart] = useState([]);

    const addItem = (

        <div className="ticket-row">

        </div>
    );

    const output = (
      <div>
          {cart}
          {addItem}
      </div>
    );


    return output;
}