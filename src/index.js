import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {login} from "./auth";
import App from './App';
import {saveItem} from "./version";


// let sampleData = {name: "mintcarrotkeys", status: "success"};
//
// saveItem("token", sampleData);



ReactDOM.render(<App />, document.getElementById('root'));

