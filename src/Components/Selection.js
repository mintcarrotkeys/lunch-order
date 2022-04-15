import React, {useState} from 'react';


export default function Selection(props) {

    const [cart, setCart] = useState([]);
    const [newItem, setNewItem] = useState(false);

    function startAddItem() {
        setNewItem(true);
    }

    let addItem = "";
    if (newItem === false) {
        addItem = (
            <div className="ticket-row">
                <div className="add-item" onClick={startAddItem}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                    </svg>
                </div>
            </div>
        );
    }

    const output = (
      <div className="ticket">
          {cart}
          {addItem}
      </div>
    );


    return output;
}